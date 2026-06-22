import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db-connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/lib/email';

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, university, major, graduationYear, skills, interests } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.create({
      name,
      email,
      passwordHash: password,
      university: university || '',
      major: major || '',
      graduationYear: graduationYear || null,
      skills: skills || [],
      interests: interests ? (Array.isArray(interests) ? interests : [interests]) : [],
      authProvider: 'email',
      emailVerified: false,
      otpHash,
      otpExpiry,
    });

    try {
      await sendOtpEmail(email, otp);
      console.log(`📧 OTP sent to ${email}`);
    } catch (emailErr) {
      console.warn(`⚠️  Email not configured — DEV OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created. Check your email for the verification code.',
      email,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
