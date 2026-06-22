import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Resume from '@/models/Resume';

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();
    const resume = await Resume.findOne({ userId: user._id, isActive: true }).sort('-createdAt');
    return NextResponse.json({ success: true, resume });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
