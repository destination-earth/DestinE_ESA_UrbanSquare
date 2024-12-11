import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const payload = req.body;

    // Log the payload for debugging purposes
    console.log('API Route - Received payload:', JSON.stringify(payload, null, 2));

    // Endpoint URL as specified
    const API_URL = 'https://api.ideas.adamplatform.eu/fixed_value';

    // Send request to the external API without authorization
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    console.log('API Route - Response status:', response.status);
    const responseText = await response.text();
    console.log('API Route - Response text:', responseText);

    // Check if the response is successful
    if (!response.ok) {
      return res.status(response.status).json({
        error: `External API request failed with status ${response.status}`,
        details: responseText,
        payload: payload, // Include the payload for debugging
      });
    }

    // Parse and return the successful response data
    const data = JSON.parse(responseText);
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Route - Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An error occurred',
    });
  }
}
