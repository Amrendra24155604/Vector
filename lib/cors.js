import { NextResponse } from 'next/server';

/**
 * Returns a 200 OK response for CORS preflight OPTIONS requests.
 * Import and call this at the top of any API route that needs it:
 *
 *   export { OPTIONS } from '@/lib/cors';
 *
 * Or if you need custom logic:
 *
 *   import { handleOptions } from '@/lib/cors';
 *   export async function OPTIONS(req) { return handleOptions(); }
 */
export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export { OPTIONS as handleOptions };
