import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('API Route - Received payload:', JSON.stringify(payload, null, 2));

    // The exact endpoint URL
    const API_URL = 'https://api.ideas.adamplatform.eu/areas';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add token in header instead of query parameter
        'Authorization': `Token bf12d6193efa667283ee9643951acfaa`
      },
      body: JSON.stringify(payload)
    });

    console.log('API Route - Response status:', response.status);
    const responseText = await response.text();
    console.log('API Route - Response text:', responseText);

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: `External API request failed with status ${response.status}`,
          details: responseText,
          payload: payload // Include the payload for debugging
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route - Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}