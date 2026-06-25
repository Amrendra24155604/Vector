import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db-connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'careerpilot_dev_secret_2024', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Email and OTP required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+otpHash +otpExpiry');
    if (!user) {
      return NextResponse.json({ success: false, message: 'No account found' }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json({ success: false, message: 'Email already verified' }, { status: 400 });
    }
    if (!user.otpHash || !user.otpExpiry) {
      return NextResponse.json({ success: false, message: 'No OTP found — request a new one' }, { status: 400 });
    }
    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ success: false, message: 'Code expired — request a new one' }, { status: 400 });
    }

    const valid = await bcrypt.compare(String(otp), user.otpHash);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Incorrect code' }, { status: 400 });
    }

    user.emailVerified = true;
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signToken(user._id);
    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
