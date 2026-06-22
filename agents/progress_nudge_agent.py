"""
CareerPilot — Progress AI Nudge Agent
Reads JSON from stdin, writes JSON results to stdout.
"""

import os
import sys
import json
from pathlib import Path

# Load .env
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=env_path)

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

class NudgeOutput(BaseModel):
    nudge: str = Field(description="A personalized, encouraging, and highly specific 1-2 sentence recommendation/nudge for the user.")

def generate_nudge(user: dict, stats: dict) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.6, openai_api_key=api_key)
    structured_llm = llm.with_structured_output(NudgeOutput)

    # Summarize stats
    funnel = stats.get("funnel", {})
    stats_summary = (
        f"- Interviews Done: {stats.get('totalSessions', 0)}\n"
        f"- Average Mock Interview Score: {stats.get('avgInterviewScore', 0)}/100\n"
        f"- Resume ATS Score: {stats.get('resumeScore', 0)}%\n"
        f"- Applications Tracker: {stats.get('totalApplications', 0)} total "
        f"({funnel.get('saved', 0)} saved, {funnel.get('applied', 0)} applied, "
        f"{funnel.get('interview', 0)} interview, {funnel.get('offer', 0)} offer, "
        f"{funnel.get('rejected', 0)} rejected)\n"
        f"- Cold Emails Generated/Sent: {stats.get('totalEmails', 0)}\n"
        f"- Daily Practice Streak: {stats.get('streak', 0)} days"
    )

    profile_summary = (
        f"Name: {user.get('name', 'User')}\n"
        f"Major: {user.get('major', 'None')}\n"
        f"Skills: {user.get('skills', 'None')}\n"
        f"Interests: {user.get('interests', 'None')}"
    )

    system_prompt = (
        "You are an expert AI Career Coach at CareerPilot.\n"
        "Your task is to analyze the candidate's profile and their dashboard progress statistics, "
        "and generate a short, highly professional, personalized, and motivating 1-2 sentence 'Nudge'.\n\n"
        f"Candidate Profile:\n{profile_summary}\n\n"
        f"Dashboard Statistics:\n{stats_summary}\n\n"
        "Rules:\n"
        "- The nudge must refer to their actual stats. For example, if they have low mock interview scores, encourage them to review STAR points or practice more. If their resume score is low (e.g. < 75%), urge them to check keywords. If they have active interviews, tell them to prep behavioral stories. If their applications count is low, suggest exploring the match board.\n"
        "- Speak directly to the candidate using their name (or 'there' if not provided).\n"
        "- NEVER congratulate the candidate on securing an interview, offer, or job. Do NOT say or assume they got/secured an interview or an offer, as this is unconfirmed. Instead, suggest preparing for upcoming sessions or applying to more positions.\n"
        "- Highlight active wins (like high average scores or great streaks) or identify critical areas of improvement (low resume score, no mock interviews done yet).\n"
        "- Keep it extremely action-oriented, professional, and positive. Avoid boilerplate language."
    )

    result = structured_llm.invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Please generate the career nudge."}
    ])

    return {"nudge": result.nudge}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        output = generate_nudge(input_data.get("user", {}), input_data.get("stats", {}))
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
