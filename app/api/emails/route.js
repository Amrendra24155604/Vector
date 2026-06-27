import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Email from '@/models/Email';
export { OPTIONS } from '@/lib/cors';

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();
    const emails = await Email.find({ userId: user._id }).sort('-createdAt').limit(20);
    return NextResponse.json({ success: true, emails });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
