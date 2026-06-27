import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Session from '@/models/Session';
import Application from '@/models/Application';
import Email from '@/models/Email';
import Resume from '@/models/Resume';
import { runPythonAgent } from '@/lib/python-runner';
export { OPTIONS } from '@/lib/cors';

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const userId = user._id;
    const { searchParams } = new URL(req.url);
    const fetchNudge = searchParams.get('nudge') === 'true';

    const [sessions, applications, emails, resume] = await Promise.all([
      Session.find({ userId, status: 'completed' }).sort('-createdAt').limit(10),
      Application.find({ userId }),
      Email.find({ userId }).sort('-createdAt').limit(5),
      Resume.findOne({ userId, isActive: true }),
    ]);

    const avgScore = sessions.length
      ? Math.round(sessions.reduce((s, sess) => s + sess.overallScore, 0) / sessions.length)
      : 0;

    const scoreHistory = sessions.slice(0, 7).reverse().map((s) => ({
      date: s.createdAt,
      score: s.overallScore,
      role: s.role,
    }));

    const funnel = {
      saved: applications.filter((a) => a.status === 'Saved').length,
      applied: applications.filter((a) => a.status === 'Applied').length,
      interview: applications.filter((a) => a.status === 'Interview').length,
      offer: applications.filter((a) => a.status === 'Offer').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
    };

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekSessions = sessions.filter((s) => s.createdAt >= oneWeekAgo);
    const weekEmails = emails.filter((e) => e.createdAt >= oneWeekAgo);

    const statsObj = {
      totalSessions: sessions.length,
      avgInterviewScore: avgScore,
      resumeScore: resume?.atsScore || user.resumeScore || 0,
      totalApplications: applications.length,
      totalEmails: emails.length,
      applicationsThisWeek: applications.filter((a) => a.createdAt >= oneWeekAgo).length,
      sessionsThisWeek: weekSessions.length,
      emailsThisWeek: weekEmails.length,
      scoreHistory,
      funnel,
      streak: user.streak || 0,
    };

    // Run Python agent to get AI Motivational Nudge only if fetchNudge is requested
    let nudge = '';
    if (fetchNudge) {
      try {
        const agentResult = await runPythonAgent('progress_nudge_agent.py', {
          user: {
            name: user.name || '',
            major: user.major || '',
            skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
            interests: Array.isArray(user.interests) ? user.interests.join(', ') : (user.interests || ''),
          },
          stats: statsObj,
        });
        if (agentResult && agentResult.nudge) {
          nudge = agentResult.nudge;
        }
      } catch (agentErr) {
        console.warn('[ProgressStats] Python nudge agent failed, using fallback:', agentErr.message);
        const nudges = [
          `You've completed ${sessions.length} sessions! Top candidates practice 3x/week — you're on the right track.`,
          `Your average score is ${avgScore}/100. Students who score 85+ get 2x more callbacks. Keep pushing!`,
          `You have ${funnel.applied} applications out. The sweet spot is 15–20 active applications at once.`,
          `Great consistency! Practicing every day for 20 mins is more effective than 2-hour cramming sessions.`,
        ];
        nudge = nudges[Math.floor(Math.random() * nudges.length)];
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        ...statsObj,
        recentSessions: sessions.slice(0, 5),
        recentApplications: applications.filter((a) => a.status === 'Applied' || a.status === 'Interview').slice(0, 5),
        aiNudge: nudge,
      },
    });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
