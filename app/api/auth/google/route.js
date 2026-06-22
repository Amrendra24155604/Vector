import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db-connect';
import User from '@/models/User';
import { verifyGoogleToken } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'careerpilot_dev_secret_2024', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { idToken } = body;
    
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Firebase ID token required' }, { status: 400 });
    }

    let googleUser;
    try {
      googleUser = await verifyGoogleToken(idToken);
    } catch (err) {
      return NextResponse.json({ success: false, message: err.message }, { status: 401 });
    }

    const { googleId, email, name, avatarUrl } = googleUser;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      user = await User.create({ name, email, googleId, authProvider: 'google', emailVerified: true, avatarUrl });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      user.authProvider = 'google';
      user.emailVerified = true;
      await user.save();
    }

    const token = signToken(user._id);
    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
