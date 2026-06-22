import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db-connect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'careerpilot_dev_secret_2024', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || user.authProvider !== 'email') {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({
        success: false,
        message: 'Please verify your email first',
        needsVerification: true,
        email,
      }, { status: 403 });
    }

    const token = signToken(user._id);
    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
