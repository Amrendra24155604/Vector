import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import User from '@/models/User';
import Session from '@/models/Session';
import Email from '@/models/Email';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get('avatar');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ success: false, message: 'No image file uploaded' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      return NextResponse.json({ success: false, message: 'Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed' }, { status: 400 });
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Image size must be less than 5MB' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `${user._id}_avatar_${Date.now()}${ext}`;
    const dir = path.join(process.cwd(), 'public/uploads/avatars');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, filename);
    await fs.promises.writeFile(filePath, buffer);
    const avatarUrl = `/uploads/avatars/${filename}`;

    const updatedUser = await User.findByIdAndUpdate(user._id, { avatarUrl }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

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
    const userObj = updatedUser.toObject();
    userObj.interviewSessionsCount = interviewSessionsCount;
    userObj.emailsSentCount = emailsSentCount;
    userObj.avgInterviewScore = avgInterviewScore;

    return NextResponse.json({ success: true, avatarUrl, user: userObj });
  } catch (err) {
    console.error('[AvatarUpload Route Error]:', err);
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
