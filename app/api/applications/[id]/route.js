import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Application from '@/models/Application';

export async function PATCH(req, { params }) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    const update = { ...body, lastUpdated: new Date() };
    if (body.status === 'Applied' && !body.appliedDate) update.appliedDate = new Date();
    if (body.status === 'Interview' && !body.interviewDate) update.interviewDate = new Date();
    if (body.status === 'Offer' && !body.offerDate) update.offerDate = new Date();

    const app = await Application.findOneAndUpdate(
      { _id: id, userId: user._id },
      update,
      { new: true, runValidators: true }
    );
    
    if (!app) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, application: app });
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
    const app = await Application.findOneAndDelete({ _id: id, userId: user._id });
    
    if (!app) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
