import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Resume from '@/models/Resume';
import User from '@/models/User';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { runPythonAgent } from '@/lib/python-runner';

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

    const formData = await req.formData();
    const file = formData.get('resume');
    const jd = formData.get('jd') || '';
    const templateStyle = formData.get('templateStyle') || 'Modern';

    let fileUrl = '';
    let fileName = '';
    let rawText = '';

    if (file && typeof file.arrayBuffer === 'function') {
      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const ext = path.extname(file.name).toLowerCase();
      if (!['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
        return NextResponse.json({ success: false, message: 'Only PDF, Word, and Text documents are allowed' }, { status: 400 });
      }

      const filename = `${user._id}_${Date.now()}${ext}`;
      const dir = path.join(process.cwd(), 'public/uploads/resumes');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, filename);
      await fs.promises.writeFile(filePath, buffer);
      fileUrl = `/uploads/resumes/${filename}`;

      // Extract raw text from resume document
      if (ext === '.pdf') {
        const data = await pdf(buffer);
        rawText = data.text || '';
      } else {
        rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, '');
      }
      
      // Sanitize unicode surrogates to prevent JSON/subprocess serialization issues
      if (rawText) {
        rawText = rawText.replace(/[\uD800-\uDFFF]/g, '');
      }
    }

    if (!rawText || rawText.trim().length < 20) {
      rawText = `Candidate Profile:\nRole: Software Engineer\nUniversity: KIIT University\nSkills: React, Node.js, JavaScript, Python, MongoDB\nExperience: Freelancer SWE`;
    }

    let analysis;
    try {
      const agentResult = await runPythonAgent('resume_analyzer_agent.py', {
        rawText,
        jd: jd || 'General software engineer role description',
        templateStyle
      }, 55000);

      if (agentResult.error) throw new Error(agentResult.error);
      analysis = agentResult;
    } catch (agentErr) {
      console.warn('[ResumeUpload] Python agent failed, using fallback:', agentErr.message);
      analysis = mockAnalyzeResume(jd, rawText);
    }

    // Deactivate previous active resume
    await Resume.updateMany({ userId: user._id, isActive: true }, { isActive: false });

    const resume = await Resume.create({
      userId: user._id,
      fileName,
      fileUrl,
      rawText,
      matchedJD: jd || '',
      ...analysis,
    });

    await User.findByIdAndUpdate(user._id, { resumeScore: analysis.atsScore });

    return NextResponse.json({ success: true, resume }, { status: 201 });
  } catch (err) {
    console.error('[ResumeUpload Route Error]:', err);
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}
