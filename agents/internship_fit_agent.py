"""
CareerPilot — Internship/Job Fit Evaluation Agent
Reads JSON from stdin, writes JSON results to stdout.

Input JSON:
{
  "profile": { "skills": "...", "major": "...", "interests": "..." },
  "jobs": [
    { "id": "...", "company": "...", "role": "...", "description": "..." },
    ...
  ]
}

Output JSON:
{
  "reasons": [
    { "id": "...", "reason": "..." },
    ...
  ]
}
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
from typing import List

class JobFitReason(BaseModel):
    id: str = Field(description="The unique id of the job matching the input job's id.")
    reason: str = Field(description="A 1-2 sentence explanation of why this job fits the user's skills, major, or interests.")

class BatchFitOutput(BaseModel):
    reasons: List[JobFitReason] = Field(description="List of fit reasons for each job.")

def evaluate_fit(profile: dict, jobs: list) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables.")

    if not jobs:
        return {"reasons": []}

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.5, openai_api_key=api_key)
    structured_llm = llm.with_structured_output(BatchFitOutput)

    # Formulate system instructions
    profile_summary = f"Skills: {profile.get('skills', 'None')}\nMajor: {profile.get('major', 'None')}\nInterests: {profile.get('interests', 'None')}"
    
    jobs_summary_list = []
    for j in jobs:
        jobs_summary_list.append(
            f"ID: {j.get('id')}\nCompany: {j.get('company')}\nRole: {j.get('role')}\nDescription: {j.get('description', '')[:300]}\n---"
        )
    jobs_summary = "\n".join(jobs_summary_list)

    system_prompt = (
        "You are an expert AI Career Coach at CareerPilot.\n"
        "Your task is to analyze a candidate's profile and a list of job/internship listings, "
        "and generate a short, professional 'Why this fits' explanation (1-2 sentences) for each job listing.\n\n"
        "Candidate Profile:\n"
        f"{profile_summary}\n\n"
        "Rules:\n"
        "- The reasons must be personalized, specific, and realistic. Don't use generic boilerplates.\n"
        "- Highlight how the candidate's skills, major, or interests connect directly to the job title/requirements.\n"
        "- If a candidate doesn't have matching technical skills, explain how their major or overall interests qualify them or fit the role.\n"
        "- Keep it positive, encouraging, and highly professional.\n"
        "- Output exactly one entry in 'reasons' for each job in the input list, referencing its correct ID."
    )

    result = structured_llm.invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Here is the list of jobs:\n\n{jobs_summary}\n\nPlease generate the reasons."}
    ])

    reasons_map = {str(r.id): r.reason for r in result.reasons}
    return {
        "reasons": [
            {
                "id": j.get("id"),
                "reason": reasons_map.get(str(j.get("id"))) or f"Matches your interest in {j.get('role')} at {j.get('company')}."
            }
            for j in jobs
        ]
    }

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        output = evaluate_fit(input_data.get("profile", {}), input_data.get("jobs", []))
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
