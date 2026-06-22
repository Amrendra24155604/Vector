import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Application from '@/models/Application';

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const all = await Application.find({ userId: user._id }).sort('-updatedAt');
    const kanban = {
      Saved: all.filter((a) => a.status === 'Saved'),
      Applied: all.filter((a) => a.status === 'Applied'),
      Interview: all.filter((a) => a.status === 'Interview'),
      Offer: all.filter((a) => a.status === 'Offer'),
      Rejected: all.filter((a) => a.status === 'Rejected'),
    };

    return NextResponse.json({ success: true, kanban });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
