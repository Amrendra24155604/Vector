import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Email from '@/models/Email';
import User from '@/models/User';
import { generateOutreach } from '@/agents/emailAgent';
export { OPTIONS } from '@/lib/cors';

export async function POST(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const body = await req.json();
    const { company, recruiterName, role, companyContext, tone, userNotes } = body;
    
    if (!company || !role) {
      return NextResponse.json({ success: false, message: 'Company and role are required' }, { status: 400 });
    }

    console.log(`API Generate: Triggering Langchain for ${company} / ${role}`);
    
    // Call the live Langchain-powered AI agent
    const { email: generatedEmail, linkedin: generatedLinkedIn } = await generateOutreach({
      company,
      role,
      recruiterName,
      companyContext,
      tone: tone || 'conversational',
      userNotes
    });

    const record = await Email.create({
      userId: user._id,
      company,
      recruiterName,
      role,
      companyContext,
      tone: tone || 'conversational',
      generatedEmail,
      generatedLinkedIn,
      userNotes,
    });

    await User.findByIdAndUpdate(user._id, { $inc: { emailsSentCount: 1 } });
    return NextResponse.json({ success: true, email: record }, { status: 201 });
  } catch (err) {
    console.error("Outreach Agent API Error:", err);
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message || "Failed to generate outreach via AI agent" }, { status: isAuthError ? 401 : 500 });
  }
}
