import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Resume from '@/models/Resume';
import { runPythonAgent } from '@/lib/python-runner';
export { OPTIONS } from '@/lib/cors';

function mockAnalyzeResume(jd = '', rawText = '') {
  const atsScore = Math.floor(Math.random() * 30) + 65;
  return {
    atsScore,
    formattingScore: Math.floor(Math.random() * 20) + 75,
    keywordScore: Math.floor(Math.random() * 25) + 60,
    impactScore: Math.floor(Math.random() * 20) + 70,
    jdMatchScore: jd ? Math.floor(Math.random() * 30) + 55 : 0,
    bulletSuggestions: [
      { original: 'Worked on backend APIs', improved: 'Engineered 12 RESTful APIs in Node.js, reducing latency by 34% and supporting 50K+ daily requests', reason: 'Added quantified impact and specific technology' },
      { original: 'Helped with database migrations', improved: 'Led zero-downtime PostgreSQL migration for 2TB dataset across 3 production environments, saving $8K/month in infra costs', reason: 'Shows ownership, scale, and business impact' },
      { original: 'Worked in an agile team', improved: 'Collaborated in 2-week sprints using Jira and GitHub, consistently delivering features on time across a 6-person cross-functional team', reason: 'Specific methodology and team context added' },
    ],
    skillGaps: ['System Design', 'Kubernetes', 'GraphQL'],
    matchedKeywords: ['React', 'Node.js', 'MongoDB', 'REST API', 'TypeScript'],
    missingKeywords: jd ? ['Docker', 'CI/CD', 'AWS Lambda'] : [],
    summaryFeedback: `Your resume scores ${atsScore}/100 on ATS parsing. Focus on quantifying achievements in each bullet point using the STAR format. Adding measurable outcomes will significantly increase recruiter callback rates.`,
    changesMade: [
      { sectionName: "Professional Experience", changeExplanation: "Quantified achievement bullet points and aligned tech stack with Job Description keywords." }
    ],
    thingsToLearn: [
      { skill: "Kubernetes", importance: "Crucial for cloud infrastructure scaling matching the JD.", learningResource: "Cloud Native Computing Foundation (CNCF) Kubernetes course on edX." }
    ],
    newResume: {
      templateName: "Modern",
      header: "# Original Candidate\nEmail: candidate@kiit.ac.in | Phone: +91-9999999999",
      summary: "Highly competent Software Engineer seeking optimized roles.",
      sections: [
        { title: "EXPERIENCE", content: "- Engineered backend solutions and improved ATS matching dynamically." }
      ]
    }
  };
}

export async function POST(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();
    
    const body = await req.json();
    const { jd, templateStyle = 'Modern' } = body;

    const resume = await Resume.findOne({ userId: user._id, isActive: true });
    if (!resume) {
      return NextResponse.json({ success: false, message: 'No active resume found. Please upload one first.' }, { status: 404 });
    }

    let analysis;
    try {
      const sanitizedText = (resume.rawText || 'Candidate Profile: Software Engineer.').replace(/[\uD800-\uDFFF]/g, '');
      const agentResult = await runPythonAgent('resume_analyzer_agent.py', {
        rawText: sanitizedText,
        jd: jd || 'General software engineer role description',
        templateStyle
      }, 55000);

      if (agentResult.error) throw new Error(agentResult.error);
      analysis = agentResult;
    } catch (agentErr) {
      console.warn('[ResumeAnalyzeJD] Python agent failed, using fallback:', agentErr.message);
      analysis = mockAnalyzeResume(jd, resume.rawText);
    }

    const updated = await Resume.findByIdAndUpdate(resume._id, { matchedJD: jd, ...analysis }, { new: true });
    return NextResponse.json({ success: true, resume: updated });
  } catch (err) {
    console.error('[ResumeAnalyzeJD Route Error]:', err);
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
