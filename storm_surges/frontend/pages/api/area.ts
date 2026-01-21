import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1800000); // 5 minutes = 300000ms

  try {
    const payload = req.body;
    const API_URL = 'https://api.ideas.adamplatform.eu/';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal, // Add abort signal
    });

    clearTimeout(timeoutId); // Clear timeout on success

    const responseText = await response.text();
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: `External API request failed with status ${response.status}`,
        details: responseText,
        payload: payload,
      });
    }

    const data = JSON.parse(responseText);
    return res.status(200).json(data);
    
  } catch (error) {
    clearTimeout(timeoutId); // Clear timeout on error
    
    // Check if error is due to timeout
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('API Route - Request timeout after 5 minutes');
      return res.status(504).json({
        error: 'Request timeout - the operation took longer than 5 minutes',
      });
    }
    
    console.error('API Route - Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An error occurred',
    });
  }
}