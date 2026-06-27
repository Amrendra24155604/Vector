import { NextResponse } from 'next/server';
export { OPTIONS } from '@/lib/cors';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Vector API is running 🚀',
  });
}
