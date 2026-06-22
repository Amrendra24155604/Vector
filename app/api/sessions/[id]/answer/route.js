import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Session from '@/models/Session';
import { runPythonAgent } from '@/lib/python-runner';

// Regex fallback scorer (used if Python agent fails)
function scoreFallback(answer) {
  const words = answer ? answer.split(' ').length : 0;
  const fillerWords = (answer || '').match(/\b(um|uh|like|basically|literally|you know|so|right)\b/gi) || [];
  const hasSituation = /situation|context|background|when|at|during/i.test(answer || '');
  const hasTask = /task|challenge|goal|objective|responsible|needed to/i.test(answer || '');
  const hasAction = /I did|I led|I built|I implemented|I decided|I created|action|step/i.test(answer || '');
  const hasResult = /result|outcome|impact|improved|reduced|increased|achieved|saved|led to/i.test(answer || '');
  const starCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  return {
    starScore: Math.min(100, starCount * 25),
    clarityScore: Math.min(100, Math.max(30, 100 - fillerWords.length * 8)),
    confidenceScore: Math.min(100, Math.max(40, Math.floor(words / 1.5))),
    technicalAccuracyScore: 50,
    hasSituation, hasTask, hasAction, hasResult,
    fillerWordCount: fillerWords.length,
    aiSuggestion: starCount < 3
      ? `Add ${!hasSituation ? 'Situation, ' : ''}${!hasTask ? 'Task, ' : ''}${!hasAction ? 'Action, ' : ''}${!hasResult ? 'Result ' : ''}to your answer.`
      : 'Good STAR structure! Try adding quantified results (numbers, percentages, timelines).',
    strengthPoints: ['Attempted the question'],
    improvementPoints: ['Add specific examples', 'Include measurable outcomes'],
  };
}

export async function PATCH(req, { params }) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const { id } = await params;
    const body = await req.json();
    const { questionIndex, answer } = body;

    const session = await Session.findOne({ _id: id, userId: user._id });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    const question = session.questions[questionIndex];
    if (!question) {
      return NextResponse.json({ success: false, message: 'Question index out of range' }, { status: 400 });
    }

    // Persist scores to the question subdocument instantly without calling evaluator
    const questions = [...session.questions];
    questions[questionIndex] = {
      ...questions[questionIndex].toObject(),
      userAnswer: answer || '',
      answeredAt: new Date(),
      // Reset scores in case of retries
      starScore: 0,
      clarityScore: 0,
      confidenceScore: 0,
      technicalAccuracyScore: 0,
      strengthPoints: [],
      improvementPoints: [],
    };
    session.questions = questions;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
