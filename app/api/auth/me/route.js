import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Session from '@/models/Session';
import Email from '@/models/Email';
export { OPTIONS } from '@/lib/cors';

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    // Query active statistics dynamically from MongoDB collections
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
    const userObj = user.toObject();
    userObj.interviewSessionsCount = interviewSessionsCount;
    userObj.emailsSentCount = emailsSentCount;
    userObj.avgInterviewScore = avgInterviewScore;

    return NextResponse.json({ success: true, user: userObj });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 401 });
  }
}
