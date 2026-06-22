import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Session from '@/models/Session';

export async function GET(req, { params }) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();
    const { id } = await params;
    const session = await Session.findOne({ _id: id, userId: user._id });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, session });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();
    const { id } = await params;
    const session = await Session.findOneAndDelete({ _id: id, userId: user._id });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
