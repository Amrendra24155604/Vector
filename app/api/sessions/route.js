import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Session from '@/models/Session';
import { runPythonAgent } from '@/lib/python-runner';

// Static fallback question bank (used if Python agent fails)
const questionBank = {
  behavioral: [
    'Tell me about a time you led a team through a difficult challenge.',
    'Describe a situation where you had to handle a conflict with a colleague.',
    'Tell me about a time you failed and what you learned from it.',
    'Describe a project where you had to work under tight deadlines.',
    'Tell me about a time you went above and beyond your role.',
  ],
  technical: [
    'Explain the difference between SQL and NoSQL databases and when to use each.',
    'How would you design a URL shortener like bit.ly?',
    'What is the time complexity of common sorting algorithms and why does it matter?',
    'Explain REST vs GraphQL and their trade-offs.',
    'How does garbage collection work in JavaScript?',
  ],
  system_design: [
    'Design a real-time chat application like WhatsApp.',
    'How would you build a scalable notification system?',
    'Design a rate limiter for an API gateway.',
    'How would you architect a food delivery platform like DoorDash?',
    'Design a distributed caching layer for a high-traffic e-commerce site.',
  ],
};

function getStaticQuestions(sessionType, numQuestions = 5) {
  const pool = questionBank[sessionType] || questionBank.behavioral;
  return pool.slice(0, numQuestions).map((q) => ({
    question: q,
    hint: 'Structure your answer using the STAR method: Situation, Task, Action, Result.',
    category: sessionType === 'behavioral' ? 'STAR Behavioral' : sessionType === 'technical' ? 'Technical' : 'System Design',
    difficulty: 'mid',
  }));
}

export async function POST(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const body = await req.json();
    const { role, company, sessionType, difficulty = 'mid', numQuestions = 5 } = body;
    if (!role) {
      return NextResponse.json({ success: false, message: 'Role is required' }, { status: 400 });
    }

    let questions;

    // Call Python question agent as a subprocess
    try {
      const agentResult = await runPythonAgent('interview_question_agent.py', {
        role,
        sessionType: sessionType || 'behavioral',
        company: company || '',
        numQuestions: Math.min(Math.max(Number(numQuestions) || 5, 3), 7),
        difficulty: difficulty || 'mid',
      }, 35000);

      if (agentResult.questions?.length > 0) {
        questions = agentResult.questions;
        console.log(`[Sessions] AI generated ${questions.length} questions for "${role}" (${sessionType})`);
      } else if (agentResult.error) {
        throw new Error(agentResult.error);
      }
    } catch (agentErr) {
      console.warn('[Sessions] Python agent failed, using static fallback:', agentErr.message);
    }

    // Fallback to static bank if agent failed
    if (!questions || questions.length === 0) {
      questions = getStaticQuestions(sessionType || 'behavioral', numQuestions);
      console.log('[Sessions] Using static fallback questions');
    }

    const session = await Session.create({
      userId: user._id,
      role,
      company: company || '',
      difficulty: difficulty || 'mid',
      sessionType: sessionType || 'behavioral',
      questions,
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();
    const sessions = await Session.find({ userId: user._id }).sort('-createdAt').limit(20);
    return NextResponse.json({ success: true, sessions });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
