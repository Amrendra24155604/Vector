import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import User from '@/models/User';
import Session from '@/models/Session';
import Email from '@/models/Email';

export async function POST(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const { paymentId } = body;

    console.log(`Processing upgrade for user ${user.email}. Payment ID: ${paymentId}`);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { isPro: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Query active statistics dynamically from MongoDB collections to keep user object synced
    const interviewSessionsCount = await Session.countDocuments({ userId: user._id });
    const emailsSentCount = await Email.countDocuments({ userId: user._id });
    
    // Query average score dynamically from completed mock interview sessions
    const completedSessions = await Session.find({ userId: user._id, status: 'completed' });
    let avgInterviewScore = 0;
    if (completedSessions.length > 0) {
      const sum = completedSessions.reduce((acc, s) => acc + (s.overallScore || 0), 0);
      avgInterviewScore = Math.round(sum / completedSessions.length);
    }

    // Convert document to plain JS object to safely append calculated stats
    const userObj = updatedUser.toObject();
    userObj.interviewSessionsCount = interviewSessionsCount;
    userObj.emailsSentCount = emailsSentCount;
    userObj.avgInterviewScore = avgInterviewScore;

    return NextResponse.json({ success: true, user: userObj });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
