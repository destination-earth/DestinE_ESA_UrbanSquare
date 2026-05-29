import type { NextApiRequest, NextApiResponse } from "next";

interface OverpassPayload {
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  tags: { key: string; value: string }[];
}

async function fetchWithRetry(query: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "DestinE_UrbanSquare (info@sistema.at)",
      },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (response.status !== 504 && response.status !== 429) return response;
    await new Promise((r) => setTimeout(r, 1000 * (i + 1))); // wait 1s, 2s, 3s
  }
  throw new Error("Overpass API unavailable after retries");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const payload = req.body as OverpassPayload;
    const { geometry, tags } = payload;
    if (!geometry || geometry.type !== "Polygon") {
      return res.status(400).json({
        error: "Invalid geometry. Expecting a GeoJSON Polygon in the request body.",
      });
    }
    // 1) Convert polygon from [lng, lat] to Overpass poly format (lat lon)
    const coordinates = geometry.coordinates[0].slice(0, -1); // drop closing duplicate
    const overpassPolyString = coordinates
      .map(([lng, lat]) => `${lat.toFixed(6)} ${lng.toFixed(6)}`)
      .join(" ");
    // 2) Build Overpass sub-queries for each key-value pair
    const overpassQueries = tags
      .map(({ key, value }) => {
        return `
          node["${key}"="${value}"](poly:"${overpassPolyString}");
          way["${key}"="${value}"](poly:"${overpassPolyString}");
          relation["${key}"="${value}"](poly:"${overpassPolyString}");
        `;
      })
      .join("\n");
    // 3) Combine everything into one Overpass QL query
    const overpassQuery = `
      [out:json][timeout:60];
      (
        ${overpassQueries}
      );
      out center;
    `;
    // 4) Send request to Overpass with retry logic
    const response = await fetchWithRetry(overpassQuery);
    const resultText = await response.text();
    if (!response.ok) {
      console.error("Overpass API error:", resultText);
      return res.status(response.status).json({
        error: "Error from Overpass API",
        details: resultText,
      });
    }
    const overpassData = JSON.parse(resultText);
    return res.status(200).json(overpassData);
  } catch (error) {
    console.error("API Route - Error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred",
    });
  }
}