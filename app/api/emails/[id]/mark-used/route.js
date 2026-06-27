import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Email from '@/models/Email';
export { OPTIONS } from '@/lib/cors';

export async function PATCH(req, { params }) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const { id } = await params;
    const record = await Email.findOneAndUpdate(
      { _id: id, userId: user._id },
      { wasUsed: true },
      { new: true }
    );
    
    if (!record) {
      return NextResponse.json({ success: false, message: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, email: record });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
