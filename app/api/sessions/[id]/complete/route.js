import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Session from '@/models/Session';
import User from '@/models/User';
import { runPythonAgent } from '@/lib/python-runner';

export async function PATCH(req, { params }) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const { id } = await params;
    const body = await req.json();
    const { durationSeconds } = body;

    const session = await Session.findOne({ _id: id, userId: user._id });
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    // Fetch last 5 completed past sessions for cumulative context
    const pastSessions = await Session.find({
      userId: user._id,
      status: 'completed',
      _id: { $ne: id },
    }).sort('-createdAt').limit(5).select('overallScore role sessionType createdAt');

    // First, evaluate all individual questions in session.questions
    const questionsList = [...session.questions];
    for (let idx = 0; idx < questionsList.length; idx++) {
      const q = questionsList[idx];
      let scores;
      try {
        const agentResult = await runPythonAgent('interview_evaluator_agent.py', {
          mode: 'evaluate',
          question: q.question,
          answer: q.userAnswer || '',
          role: session.role,
          sessionType: session.sessionType,
          questionIndex: idx,
        }, 30000);

        if (agentResult.error) throw new Error(agentResult.error);
        scores = agentResult;
        console.log(`[Complete] AI scored Q${idx+1} — STAR:${scores.starScore}, Clarity:${scores.clarityScore}`);
      } catch (agentErr) {
        console.warn(`[Complete] Python agent failed for Q${idx+1}, using fallback:`, agentErr.message);
        const answer = q.userAnswer || '';
        const words = answer ? answer.split(' ').length : 0;
        const fillerWords = (answer || '').match(/\b(um|uh|like|basically|literally|you know|so|right)\b/gi) || [];
        const hasSituation = /situation|context|background|when|at|during/i.test(answer);
        const hasTask = /task|challenge|goal|objective|responsible|needed to/i.test(answer);
        const hasAction = /I did|I led|I built|I implemented|I decided|I created|action|step/i.test(answer);
        const hasResult = /result|outcome|impact|improved|reduced|increased|achieved|saved|led to/i.test(answer);
        
        const clean_ans = answer.trim ? answer.trim().toLowerCase() : answer.toLowerCase();
        const is_greeting = ["hello everyone how are you all", "hello", "hi", "how are you", "good morning"].includes(clean_ans);
        
        const starCount = is_greeting ? 0 : [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
        scores = {
          starScore: is_greeting ? 0 : Math.min(100, starCount * 25),
          clarityScore: is_greeting ? 0 : Math.min(100, Math.max(30, 100 - fillerWords.length * 8)),
          confidenceScore: is_greeting ? 0 : Math.min(100, Math.max(40, Math.floor(words / 1.5))),
          technicalAccuracyScore: is_greeting ? 0 : 50,
          hasSituation: is_greeting ? false : hasSituation,
          hasTask: is_greeting ? false : hasTask,
          hasAction: is_greeting ? false : hasAction,
          hasResult: is_greeting ? false : hasResult,
          fillerWordCount: fillerWords.length,
          aiSuggestion: is_greeting ? "The answer provided was a simple greeting or completely out of context." : "Good effort!",
          strengthPoints: is_greeting ? [] : ['Attempted the question'],
          improvementPoints: is_greeting ? ['Provide a relevant answer.'] : ['Add specific details'],
          sampleCorrectAnswer: is_greeting 
            ? "A strong answer should demonstrate professional problem-solving or a relevant experience. For example, explain how you would design or implement a solution systematically using the STAR framework."
            : "To optimize this further, describe your concrete responsibility, detailed actions, and positive results using exact metrics."
        };
      }

      questionsList[idx] = {
        ...questionsList[idx].toObject(),
        starScore: scores.starScore,
        clarityScore: scores.clarityScore,
        confidenceScore: scores.confidenceScore,
        technicalAccuracyScore: scores.technicalAccuracyScore || 50,
        hasSituation: scores.hasSituation,
        hasTask: scores.hasTask,
        hasAction: scores.hasAction,
        hasResult: scores.hasResult,
        fillerWordCount: scores.fillerWordCount,
        aiSuggestion: scores.aiSuggestion,
        strengthPoints: scores.strengthPoints || [],
        improvementPoints: scores.improvementPoints || [],
        sampleCorrectAnswer: scores.sampleCorrectAnswer || '',
      };
    }
    session.questions = questionsList;

    // Build Q&A pairs for the report agent
    const qaPairs = session.questions.map((q) => ({
      question: q.question,
      answer: q.userAnswer || '',
      starScore: q.starScore || 0,
      clarityScore: q.clarityScore || 0,
      confidenceScore: q.confidenceScore || 0,
    }));

    let report = null;

    // Call Python report agent as a subprocess (mode: report)
    try {
      const agentResult = await runPythonAgent('interview_evaluator_agent.py', {
        mode: 'report',
        role: session.role,
        sessionType: session.sessionType,
        qaPairs,
        pastSessions: pastSessions.map((s) => ({
          overallScore: s.overallScore,
          role: s.role,
          sessionType: s.sessionType,
          createdAt: s.createdAt?.toISOString() || '',
        })),
      }, 45000); // 45s — full report takes longer

      if (agentResult.error) throw new Error(agentResult.error);
      report = agentResult;
      console.log(`[Complete] AI report — Score:${report.overallScore}, Cumulative:${report.cumulativeScore}, Level:${report.readinessLevel}`);
    } catch (agentErr) {
      console.warn('[Complete] Python agent failed, using arithmetic fallback:', agentErr.message);
    }

    // Arithmetic fallback if agent failed
    const answered = session.questions.filter((q) => q.userAnswer);
    const avg = (key) =>
      answered.length ? Math.round(answered.reduce((s, q) => s + (q[key] || 0), 0) / answered.length) : 0;

    const fallbackOverall = Math.round(avg('starScore') * 0.4 + avg('clarityScore') * 0.3 + avg('confidenceScore') * 0.3);

    // Apply AI report or fallback
    session.overallScore = report?.overallScore ?? fallbackOverall;
    session.starComplianceScore = avg('starScore');
    session.clarityScore = avg('clarityScore');
    session.confidenceScore = avg('confidenceScore');
    session.technicalScore = avg('technicalAccuracyScore');
    session.durationSeconds = durationSeconds || 0;
    session.status = 'completed';

    if (report) {
      session.strengths = report.strengths || [];
      session.improvements = report.improvements || [];
      session.coachTip = report.coachTip || '';
      session.aiReport = report.aiReport || '';
      session.readinessLevel = report.readinessLevel || '';
      session.nextSessionFocus = report.nextSessionFocus || '';
      session.cumulativeScoreAtTime = report.cumulativeScore || session.overallScore;
    } else {
      const sc = session.overallScore;
      if (sc <= 30) {
        session.strengths = [];
        session.improvements = ['Ensure answers address the specific question prompts.', 'Explain your experience using the STAR structure.', 'Avoid simple conversational greetings or generic remarks.'];
        session.coachTip = `Your overall score is ${sc}/100. You need to attempt the questions with concrete context and technical/behavioral details. Avoid generic greetings.`;
        session.readinessLevel = 'Developing';
        session.cumulativeScoreAtTime = sc;
      } else {
        session.strengths = sc >= 80 ? ['Strong STAR structure', 'Clear communication', 'Good confidence']
          : ['Solid effort', 'Good context setting', 'Completed the session'];
        session.improvements = ['Reduce filler words', 'Add quantified results', 'Strengthen Task descriptions'];
        session.coachTip = `Your overall score is ${sc}/100. ${sc >= 80
          ? 'Excellent! Push results to be more data-driven with specific numbers.'
          : 'Focus on completing all 4 STAR components in every answer.'}`;
        session.readinessLevel = sc >= 85 ? 'Senior Ready' : sc >= 70 ? 'Mid Ready' : sc >= 50 ? 'Junior Ready' : 'Developing';
        session.cumulativeScoreAtTime = sc;
      }
    }

    await session.save();

    // Update user: increment session count + update cumulative score & readiness
    const allCompleted = await Session.find({ userId: user._id, status: 'completed' }).select('overallScore');
    const newCumulative = allCompleted.length
      ? Math.round(allCompleted.reduce((s, sess) => s + sess.overallScore, 0) / allCompleted.length)
      : session.overallScore;

    await User.findByIdAndUpdate(user._id, {
      $inc: { interviewSessionsCount: 1 },
      cumulativeInterviewScore: report?.cumulativeScore ?? newCumulative,
      readinessLevel: session.readinessLevel,
    });

    return NextResponse.json({ success: true, session });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
