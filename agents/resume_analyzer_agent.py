"""
CareerPilot — Advanced Resume Analyzer, Matcher, and Rebuilder Agent
Called as a subprocess by the Next.js API route.
Reads JSON from stdin, writes JSON result to stdout.

Input:  { rawText, jd, templateStyle }
Output: ResumeAnalysisResult schema (atsScore, formattingScore, keywordScore,
        impactScore, jdMatchScore, bulletSuggestions, skillGaps,
        matchedKeywords, missingKeywords, summaryFeedback, changesMade,
        thingsToLearn, newResume)
"""

import os
import sys
import json
from pathlib import Path

# Reconfigure stdin/stdout/stderr to ignore surrogate encoding/decoding errors globally
if hasattr(sys.stdin, 'reconfigure'):
    sys.stdin.reconfigure(errors='ignore')
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(errors='ignore')
    sys.stderr.reconfigure(errors='ignore')

# Load .env from the frontend root (two levels up from agents/)
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=env_path)

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List, Optional


# ── Pydantic schemas ───────────────────────────────────────────────────────

class ResumeBulletSuggestion(BaseModel):
    original: str = Field(description="The original weak or unquantified bullet point from the resume.")
    improved: str = Field(description="The improved version of the bullet point, optimized for ATS (STAR format, active verbs, quantified metrics).")
    reason: str = Field(description="The reason for the improvement, explaining what was added or changed.")


class SectionChange(BaseModel):
    sectionName: str = Field(description="Name of the section (e.g. Professional Experience, Projects, Skills, Summary).")
    changeExplanation: str = Field(description="A brief description of what was changed and optimized in this section.")


class SuggestedSkillToLearn(BaseModel):
    skill: str = Field(description="The skill name (e.g. Kubernetes, System Design, Terraform).")
    importance: str = Field(description="Why this skill is highly applicable or required for this job description.")
    learningResource: str = Field(description="A recommended quick learning resource or certification to acquire this skill.")


class RebuiltResumeSection(BaseModel):
    title: str = Field(description="The title of the section (e.g. PROFESSIONAL EXPERIENCE, EDUCATION, SKILLS).")
    content: str = Field(description="The structured markdown content of this section, tailored specifically to the selected template style.")


class RebuiltResume(BaseModel):
    templateName: str = Field(description="The template style used (e.g. Modern, Minimalist, Creative, Executive).")
    header: str = Field(description="The contact information and header section formatted beautifully in markdown.")
    summary: str = Field(description="The professional summary/objective section optimized with key keywords from the JD.")
    sections: List[RebuiltResumeSection] = Field(description="The structured sections of the new resume.")


class ResumeAnalysisResult(BaseModel):
    atsScore: int = Field(description="The overall calculated ATS score (0-100) matching the resume against the JD.")
    formattingScore: int = Field(description="Score for formatting, structure, and readability (0-100).")
    keywordScore: int = Field(description="Score for keyword density and relevance (0-100).")
    impactScore: int = Field(description="Score for quantified impact and active verb usage (0-100).")
    jdMatchScore: int = Field(description="Relevance score matching the resume's experience directly with the JD (0-100).")
    bulletSuggestions: List[ResumeBulletSuggestion] = Field(description="Specific bullet point optimizations.")
    skillGaps: List[str] = Field(description="Key skills required in the JD but missing from the resume.")
    matchedKeywords: List[str] = Field(description="Important keywords from the JD found in the resume.")
    missingKeywords: List[str] = Field(description="Important keywords from the JD missing from the resume.")
    summaryFeedback: str = Field(description="Overall feedback on the resume, highlighting its strengths and core gaps.")
    changesMade: List[SectionChange] = Field(description="List of explicit section-level changes made in the optimized resume.")
    thingsToLearn: List[SuggestedSkillToLearn] = Field(description="Personalized recommendations of what the user needs to learn to stand out.")
    newResume: RebuiltResume = Field(description="The completely rebuilt, optimized, and tailored new resume structured sections.")


# ── Helper ─────────────────────────────────────────────────────────────────

def get_llm(model: str, temperature: float):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")
    return ChatOpenAI(model=model, temperature=temperature, openai_api_key=api_key)


# ── Core Agent Logic ───────────────────────────────────────────────────────

def analyze_and_rebuild_resume(rawText: str, jd: str, templateStyle: str = "Modern") -> dict:
    if not rawText or len(rawText.strip()) < 50:
        raise ValueError("Resume raw text is too short or unreadable. Please upload a valid document.")

    # Context setting based on template style selection
    template_instructions = {
        "Modern": "Modern template: Vibrant layout, clear bullet points, crisp dividers, highlight core projects first.",
        "Minimalist": "Minimalist template: Sleek, compact executive spacing, thin dividers, neat typography, summary-first layout.",
        "Creative": "Creative template: Dynamic professional summary, highlights projects and active achievements prominently.",
        "Executive": "Executive template: Strong focus on leadership, quantified business outcomes, cost reductions, and scaling.",
    }.get(templateStyle, "Modern style.")

    system_prompt = (
        "You are an elite ATS optimizer, senior resume designer, and technical recruiter.\n\n"
        "Your task is to analyze the candidate's raw resume text and align it perfectly with the provided Job Description (JD).\n\n"
        "INSTRUCTIONS FOR EVALUATION & MATCHING:\n"
        "- Compute genuine scores based on text alignment, keyword overlaps, and structural quality.\n"
        "- Highlight exact skill gaps, matched keywords, and missing keywords.\n"
        "- Select 3 weak/unquantified bullet points from the original resume and optimize them using the STAR method with specific metrics and active verbs.\n"
        "- Outline explicit changes made to improve readability, ATS performance, and impact.\n"
        "- Suggest 3 concrete topics/skills the candidate should learn, including quick learning paths or certifications.\n\n"
        "INSTRUCTIONS FOR REBUILDING THE RESUME:\n"
        f"- Rebuild the resume completely inside the 'newResume' object using the selected style: {templateStyle} ({template_instructions}).\n"
        "- Optimize all bullet points, summary objectives, and experience details in the rebuilt sections.\n"
        "- CRITICAL RULE 1: DO NOT USE ANY RAW MARKDOWN BOLD SYMBOLS (like '**') OR RAW ITALICS SYMBOLS (like '*') INSIDE ANY OF THE RESUME TEXT OR SECTIONS. Bold text inside plain text looks very messy and AI-generated. The styling engine will automatically format titles and key metadata. Keep the resume body text clean, raw, and elegant without any double-asterisk ('**') tags.\n"
        "- CRITICAL RULE 2: ABSOLUTELY NO SPELLING, TYPOGRAPHICAL, OR GRAMMATICAL ERRORS. You must act as a precise copy-editor. If the candidate's original resume has typing mistakes, correct them. Ensure all technical terms, company names, and verbs are spelled correctly.\n"
        "- CRITICAL RULE 3: ELIMINATE CHEAP AI BUZZWORDS. Do not over-use clichéd AI jargon like 'spearheaded', 'leveraged', 'synergized', 'optimized', 'game-changing', 'pivot', or 'cutting-edge' in every single sentence. Write clean, direct, metrics-backed professional sentences that sound like they were written by a top human executive writer.\n"
        "- CRITICAL RULE 4: STRUCTURED METADATA WITH PIPES. For every job role, project, or educational entry in the section content, start with a line separating fields using pipes (e.g. 'Job Title | Company Name | Dates' or 'Project Name | Tech Stack | Dates' or 'Degree | University | Dates'). This allows the rendering engine to parse and align them perfectly (e.g., job titles bold, dates right-aligned). Do not use markdown headers for job entries; use the pipe format on a single line instead.\n"
        "- Do not use any placeholder data or mock values. The rebuilt sections must feel premium, authentic, and complete."
    )

    user_prompt = (
        f"JOB DESCRIPTION:\n{jd}\n\n"
        f"CANDIDATE ORIGINAL RESUME TEXT:\n{rawText}\n\n"
        f"Analyze and completely rebuild the resume in '{templateStyle}' style."
    )

    llm = get_llm("gpt-4o", 0.3)
    result = llm.with_structured_output(ResumeAnalysisResult).invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ])

    return {
        "atsScore": max(0, min(100, result.atsScore)),
        "formattingScore": max(0, min(100, result.formattingScore)),
        "keywordScore": max(0, min(100, result.keywordScore)),
        "impactScore": max(0, min(100, result.impactScore)),
        "jdMatchScore": max(0, min(100, result.jdMatchScore)),
        "bulletSuggestions": [
            {
                "original": s.original,
                "improved": s.improved,
                "reason": s.reason
            } for s in result.bulletSuggestions[:3]
        ],
        "skillGaps": result.skillGaps[:5],
        "matchedKeywords": result.matchedKeywords[:10],
        "missingKeywords": result.missingKeywords[:10],
        "summaryFeedback": result.summaryFeedback,
        "changesMade": [
            {
                "sectionName": c.sectionName,
                "changeExplanation": c.changeExplanation
            } for c in result.changesMade
        ],
        "thingsToLearn": [
            {
                "skill": t.skill,
                "importance": t.importance,
                "learningResource": t.learningResource
            } for t in result.thingsToLearn[:4]
        ],
        "newResume": {
            "templateName": result.newResume.templateName,
            "header": result.newResume.header,
            "summary": result.newResume.summary,
            "sections": [
                {
                    "title": s.title,
                    "content": s.content
                } for s in result.newResume.sections
            ]
        }
    }


if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        output = analyze_and_rebuild_resume(**input_data)
        sys.stdout.buffer.write(json.dumps(output).encode('utf-8', errors='ignore'))
        sys.exit(0)
    except Exception as e:
        import traceback
        traceback_msg = traceback.format_exc()
        sys.stderr.buffer.write(traceback_msg.encode('utf-8', errors='ignore'))
        sys.exit(1)
