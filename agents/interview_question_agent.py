"""
CareerPilot — Interview Question Generator Agent
Called as a subprocess by the Next.js API route.
Reads JSON from stdin, writes JSON result to stdout.

Input JSON: { role, sessionType, company, numQuestions, difficulty }
Output JSON: { questions: [{ question, hint, category, difficulty }] }
"""

import os
import sys
import json
from pathlib import Path

# ── Load .env from the frontend root (two levels up from agents/) ──────────
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=env_path)

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List


# ── Pydantic schemas for structured output ─────────────────────────────────

class InterviewQuestion(BaseModel):
    question: str = Field(description="The interview question text, phrased clearly and directly.")
    hint: str = Field(description="A helpful 1-2 sentence hint on how to approach or structure the answer.")
    category: str = Field(description="Category label, e.g. 'STAR Behavioral', 'Algorithm', 'System Design', 'OOP', 'Leadership'.")
    difficulty: str = Field(description="Exactly one of: 'beginner', 'mid', 'senior'.")


class QuestionsOutput(BaseModel):
    questions: List[InterviewQuestion] = Field(description="List of generated interview questions.")


# ── Core generation function ───────────────────────────────────────────────

def generate_questions(role: str, sessionType: str, company: str = "",
                       numQuestions: int = 5, difficulty: str = "mid") -> dict:

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.8, openai_api_key=api_key)
    structured_llm = llm.with_structured_output(QuestionsOutput)

    company_ctx = f" at {company}" if company else ""
    num = min(max(int(numQuestions), 3), 7)

    difficulty_desc = {
        "beginner": "entry-level (0–1 year experience), focus on fundamentals and basics",
        "mid": "mid-level (2–4 years experience), focus on applied problem solving",
        "senior": "senior-level (5+ years), focus on leadership, architecture, and deep expertise",
    }.get(difficulty, "mid-level (2–4 years experience)")

    type_instructions = {
        "behavioral": (
            f"Generate {num} behavioral interview questions for a {role}{company_ctx}. "
            "Use STAR-format prompts: 'Tell me about a time...', 'Describe a situation where...'. "
            "Each hint should guide the candidate to use the STAR method."
        ),
        "technical": (
            f"Generate {num} technical interview questions for a {role}{company_ctx}. "
            "Cover algorithms, data structures, language concepts, debugging, and code quality. "
            "Each hint should explain what key concept the question is testing."
        ),
        "system_design": (
            f"Generate {num} system design interview questions for a {role}{company_ctx}. "
            "Focus on distributed systems, scalability, APIs, caching, and trade-offs. "
            "Each hint should list the key architectural dimensions to address."
        ),
    }.get(sessionType, f"Generate {num} interview questions for a {role}{company_ctx}.")

    system_prompt = (
        f"You are an expert technical interviewer at a top-tier tech company.\n"
        f"Candidate level: {difficulty_desc}.\n\n"
        f"{type_instructions}\n\n"
        f"Rules:\n"
        f"- Questions must be realistic — the kind actually asked at FAANG/top startups.\n"
        f"- Do NOT generate generic or overly simple questions.\n"
        f"- Each hint must be genuinely helpful but NOT give away the answer.\n"
        f"- difficulty field must exactly match: {difficulty}\n"
        f"- Generate exactly {num} questions."
    )

    result = structured_llm.invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Generate {num} {difficulty}-level {sessionType} questions for a {role} role{company_ctx}."}
    ])

    return {
        "questions": [
            {"question": q.question, "hint": q.hint, "category": q.category, "difficulty": q.difficulty}
            for q in result.questions
        ]
    }


# ── Subprocess entry point: read JSON from stdin, write JSON to stdout ──────

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        output = generate_questions(**input_data)
        print(json.dumps(output))
    except Exception as e:
        # Print error as JSON so the JS side can parse it cleanly
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
