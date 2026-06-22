"""
CareerPilot — Interview Answer Evaluator & Session Report Agent
Called as a subprocess by the Next.js API route.
Reads JSON from stdin, writes JSON result to stdout.

Mode 1 — evaluate_answer:
  Input:  { mode: "evaluate", question, answer, role, sessionType, questionIndex }
  Output: { starScore, clarityScore, confidenceScore, technicalAccuracyScore,
            hasSituation, hasTask, hasAction, hasResult, fillerWordCount,
            aiSuggestion, strengthPoints, improvementPoints }

Mode 2 — generate_report:
  Input:  { mode: "report", role, sessionType, qaPairs, pastSessions }
  Output: { overallScore, cumulativeScore, coachTip, strengths, improvements,
            aiReport, readinessLevel, nextSessionFocus }
"""

import os
import sys
import re
import json
from pathlib import Path

# Reconfigure stdin/stdout/stderr to ignore surrogate encoding/decoding errors globally
if hasattr(sys.stdin, 'reconfigure'):
    sys.stdin.reconfigure(errors='ignore')
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(errors='ignore')
    sys.stderr.reconfigure(errors='ignore')

# ── Load .env from the frontend root (two levels up from agents/) ──────────
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=env_path)

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List, Optional


# ── Pydantic schemas ───────────────────────────────────────────────────────

class AnswerEvaluation(BaseModel):
    starScore: int = Field(description="STAR compliance score 0–100. Each of Situation/Task/Action/Result worth 25 pts.")
    clarityScore: int = Field(description="Communication clarity score 0–100. Penalize filler words and rambling.")
    confidenceScore: int = Field(description="Confidence score 0–100. Active voice, decisive statements = higher score.")
    technicalAccuracyScore: int = Field(description="Technical accuracy 0–100. For behavioral: relevance. For technical: correctness and depth.")
    hasSituation: bool = Field(description="True if the answer clearly establishes a Situation or Context.")
    hasTask: bool = Field(description="True if the answer clearly describes the Task or Responsibility.")
    hasAction: bool = Field(description="True if the answer describes concrete Actions taken.")
    hasResult: bool = Field(description="True if the answer shares measurable Results or Outcomes.")
    fillerWordCount: int = Field(description="Count of filler words detected (um, uh, like, basically, you know, so, literally).")
    aiSuggestion: str = Field(description="One specific, actionable coaching tip in 2–3 sentences. Be direct and constructive.")
    strengthPoints: List[str] = Field(description="2–3 specific strengths from this answer. Be concrete, not generic.")
    improvementPoints: List[str] = Field(description="2–3 specific improvement areas. Be constructive and actionable.")
    sampleCorrectAnswer: str = Field(description="An exemplar correct answer (2-4 sentences max). If the user is incorrect, wrong, or has a low score (< 70), provide a short, correct exemplar answer. If the user's answer is strong/correct (>= 70), write 'Bravo! You are correct!' or similar praise followed by a brief highlight of what was stellar.")


class SessionReport(BaseModel):
    overallScore: int = Field(description="Session overall score 0–100. Weighted: STAR 40%, clarity 30%, confidence 30%.")
    cumulativeScore: int = Field(description="Weighted cumulative across all sessions. Current session = 50% weight, past sessions averaged for remaining 50%. If no past sessions, equals overallScore.")
    coachTip: str = Field(description="The single most impactful coaching tip based on full session performance (2–3 sentences).")
    strengths: List[str] = Field(description="3–5 key strengths demonstrated across the full session.")
    improvements: List[str] = Field(description="3–5 prioritized improvement areas for the next session.")
    aiReport: str = Field(description="Comprehensive session narrative (4–6 sentences) written as a professional coach. Cover performance arc, patterns, standout moments, and overall trajectory.")
    readinessLevel: str = Field(description="Exactly one of: 'Not Ready', 'Developing', 'Junior Ready', 'Mid Ready', 'Senior Ready'.")
    nextSessionFocus: str = Field(description="Specific, personalized recommendation for next session (1–2 sentences).")


# ── Helper ─────────────────────────────────────────────────────────────────

def count_filler_words(text: str) -> int:
    if not text:
        return 0
    return len(re.findall(r'\b(um|uh|like|basically|literally|you know|so|right|kind of|sort of)\b', text, re.IGNORECASE))


def get_llm(model: str, temperature: float):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")
    return ChatOpenAI(model=model, temperature=temperature, openai_api_key=api_key)


# ── Mode 1: Evaluate a single answer ──────────────────────────────────────

def evaluate_answer(question: str, answer: str, role: str, sessionType: str,
                    questionIndex: int = 0) -> dict:

    if not answer or len(answer.strip()) < 10:
        return {
            "starScore": 0, "clarityScore": 0, "confidenceScore": 0, "technicalAccuracyScore": 0,
            "hasSituation": False, "hasTask": False, "hasAction": False, "hasResult": False,
            "fillerWordCount": 0,
            "aiSuggestion": "No answer was provided. Attempt every question — even partial answers show effort and reveal growth areas.",
            "strengthPoints": [],
            "improvementPoints": ["Attempt to answer every question, even partially.", "Practice thinking aloud to structure your thoughts."],
            "sampleCorrectAnswer": "To construct a successful answer, describe a concrete experience or technical design. For example, explain how you would design or implement a solution step-by-step using the STAR framework."
        }

    # Pre-filtering greetings or gibberish answers that do not address the question at all
    clean_ans = answer.strip().lower().replace(".", "").replace("!", "").replace("?", "")
    greetings = ["hello everyone how are you all", "hello", "hi", "how are you", "good morning", "good afternoon", "good evening", "hey there"]
    
    is_greeting = clean_ans in greetings or any(clean_ans == g for g in greetings)
    
    if is_greeting or (len(clean_ans.split()) <= 8 and any(x in clean_ans for x in ["how are you", "who are you", "what is this", "hello", "hi there"])):
        return {
            "starScore": 0, "clarityScore": 0, "confidenceScore": 0, "technicalAccuracyScore": 0,
            "hasSituation": False, "hasTask": False, "hasAction": False, "hasResult": False,
            "fillerWordCount": 0,
            "aiSuggestion": "The answer provided was a simple greeting or completely out of context. You must attempt to answer the question prompt rather than providing generic conversational remarks.",
            "strengthPoints": [],
            "improvementPoints": ["Provide an answer that is relevant to the question prompt.", "Explain your technical or behavioral experience."],
            "sampleCorrectAnswer": "A strong answer should demonstrate professional problem-solving or a relevant experience. For example, explain how you would design or implement a solution systematically using the STAR framework."
        }

    filler_count = count_filler_words(answer)

    type_context = {
        "behavioral": "Behavioral interview. Evaluate using the STAR framework. Strong answers are specific, concrete, and data-driven.",
        "technical": "Technical interview. Evaluate on accuracy, depth, problem-solving approach, and clarity. STAR is secondary — solution quality is paramount.",
        "system_design": "System design interview. Evaluate architecture thinking, scalability awareness, trade-off recognition, and structured reasoning.",
    }.get(sessionType, "Evaluate the answer holistically.")

    system_prompt = (
        f"You are an elite interview coach and senior hiring manager evaluating a {role} candidate.\n\n"
        f"{type_context}\n\n"
        f"CRITICAL SCORING RULES:\n"
        f"- If the candidate's answer is completely irrelevant, off-topic, a conversational greeting (e.g., 'Hello everyone how are you all'), gibberish, or avoids addressing the question prompt, you MUST score it EXACTLY 0 across ALL metrics: starScore=0, clarityScore=0, confidenceScore=0, and technicalAccuracyScore=0. Do NOT praise greetings or gibberish as strengths. Return an empty list for strengthPoints, and list relevant improvements.\n"
        f"- 80–100: Genuinely strong, specific, data-driven answers that directly address the question prompt\n"
        f"- 50–79: Passable but improvable\n"
        f"- <50: Vague, incomplete, or off-topic answers\n\n"
        f"Note: The answer may be voice-transcribed — ignore minor spelling errors, judge on substance.\n"
        f"Pre-detected filler words: approximately {filler_count}."
    )

    user_prompt = f"Question: {question}\n\nCandidate Answer: {answer}\n\nEvaluate thoroughly."

    llm = get_llm("gpt-4o", 0.3)
    result = llm.with_structured_output(AnswerEvaluation).invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ])

    return {
        "starScore": max(0, min(100, result.starScore)),
        "clarityScore": max(0, min(100, result.clarityScore)),
        "confidenceScore": max(0, min(100, result.confidenceScore)),
        "technicalAccuracyScore": max(0, min(100, result.technicalAccuracyScore)),
        "hasSituation": result.hasSituation,
        "hasTask": result.hasTask,
        "hasAction": result.hasAction,
        "hasResult": result.hasResult,
        "fillerWordCount": result.fillerWordCount,
        "aiSuggestion": result.aiSuggestion,
        "strengthPoints": result.strengthPoints[:3] if result.starScore > 0 or result.clarityScore > 0 else [],
        "improvementPoints": result.improvementPoints[:3],
        "sampleCorrectAnswer": result.sampleCorrectAnswer,
    }


# ── Mode 2: Generate full session report ──────────────────────────────────

def generate_report(role: str, sessionType: str, qaPairs: list, pastSessions: list = None) -> dict:
    pastSessions = pastSessions or []

    qa_summary = "\n\n".join([
        f"Q{i+1}: {p.get('question', '')}\n"
        f"Answer: {p.get('answer', '') or '[Skipped]'}\n"
        f"Scores — STAR: {p.get('starScore', 0)}, Clarity: {p.get('clarityScore', 0)}, Confidence: {p.get('confidenceScore', 0)}"
        for i, p in enumerate(qaPairs)
    ])

    if pastSessions:
        past_lines = "\n".join([
            f"- Session {i+1}: Role={s.get('role','?')}, Type={s.get('sessionType','?')}, Score={s.get('overallScore',0)}/100 ({str(s.get('createdAt',''))[:10]})"
            for i, s in enumerate(pastSessions[-5:])
        ])
        avg_past = sum(s.get('overallScore', 0) for s in pastSessions) / len(pastSessions)
        past_ctx = f"\nPast Sessions:\n{past_lines}\nAverage past score: {avg_past:.0f}/100"
    else:
        past_ctx = "\nThis is the candidate's FIRST session. Set cumulativeScore = overallScore."

    system_prompt = (
        f"You are an elite interview coach reviewing a complete {sessionType} mock interview for a {role} candidate.\n"
        f"Be thorough, honest, and constructive. Reference specific answers where possible.\n"
        f"For cumulativeScore: current session = 50% weight, past sessions averaged = 50% weight. "
        f"If no past sessions, cumulativeScore = overallScore.\n"
        f"{past_ctx}"
    )

    user_prompt = f"Full Session Q&A:\n{qa_summary}\n\nGenerate the comprehensive report."

    llm = get_llm("gpt-4o", 0.4)
    result = llm.with_structured_output(SessionReport).invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ])

    return {
        "overallScore": max(0, min(100, result.overallScore)),
        "cumulativeScore": max(0, min(100, result.cumulativeScore)),
        "coachTip": result.coachTip,
        "strengths": result.strengths[:5],
        "improvements": result.improvements[:5],
        "aiReport": result.aiReport,
        "readinessLevel": result.readinessLevel,
        "nextSessionFocus": result.nextSessionFocus,
    }


# ── Subprocess entry point: stdin JSON → stdout JSON ───────────────────────

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        mode = input_data.pop("mode", "evaluate")

        if mode == "report":
            output = generate_report(**input_data)
        else:
            output = evaluate_answer(**input_data)

        sys.stdout.buffer.write(json.dumps(output).encode('utf-8', errors='ignore'))
        sys.exit(0)
    except Exception as e:
        error_msg = json.dumps({"error": str(e)})
        sys.stderr.buffer.write(error_msg.encode('utf-8', errors='ignore'))
        sys.exit(1)
