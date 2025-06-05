import { NextApiRequest, NextApiResponse } from 'next';

// For Pages Router
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user ID from the x-auth-request-user header
  const userId = req.headers['x-auth-request-user'] as string || 'anonymous';
  
  res.status(200).json({ userId });
}

// OR for App Router (app/api/user/route.ts):
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get user ID from the x-auth-request-user header
  const userId = request.headers.get('x-auth-request-user') || 'anonymous';
  
  return NextResponse.json({ userId });
}