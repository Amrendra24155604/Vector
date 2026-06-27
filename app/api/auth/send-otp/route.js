import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db-connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/lib/email';
export { OPTIONS } from '@/lib/cors';

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'No account found with this email' }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json({ success: false, message: 'Email already verified' }, { status: 400 });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    user.otpHash = otpHash;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOtpEmail(email, otp);
    } catch (err) {
      console.warn(`⚠️  Email not configured — DEV OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({ success: true, message: 'Verification code sent' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
