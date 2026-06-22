import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Zod Schema to guarantee strict structured JSON outputs from Langchain
const outreachSchema = z.object({
  email: z.string().describe(
    "A customized, highly personalized, and persuasive cold email outreach template. It must integrate the company details, context, and tone cleanly. Avoid classic AI clichés."
  ),
  linkedin: z.string().describe(
    "A highly concise and human LinkedIn connection request or direct message copy. Typically under 300 characters, extremely readable."
  )
});

/**
 * Generates personalized cold email and LinkedIn message copy using ChatOpenAI and Langchain.
 * @param {Object} params Outreach generation parameters
 * @param {string} params.company Target Company
 * @param {string} params.role Target Role
 * @param {string} [params.recruiterName] Name of recruiter or hiring manager
 * @param {string} [params.companyContext] Context on what excites the candidate about the company
 * @param {string} [params.tone] Requested tone ('formal', 'conversational', 'bold')
 * @param {string} [params.userNotes] Additional candidate notes, projects, or background details to weave in
 * @returns {Promise<{ email: string, linkedin: string }>} Validated JSON response containing the drafts
 */
export async function generateOutreach({ company, role, recruiterName, companyContext, tone = 'conversational', userNotes }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in the server environment variables.");
  }

  // Initialize the Langchain ChatOpenAI model targeting the high-speed GPT-4o-Mini engine
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    openAIApiKey: apiKey
  });

  // Apply strict schema validation to the model's outputs
  const structuredLlm = model.withStructuredOutput(outreachSchema);

  // Construct a prompt context
  const greeting = recruiterName ? `Dear ${recruiterName},` : "Dear Hiring Manager,";
  
  const systemInstruction = `You are an elite, highly empathetic outbound recruiting expert and executive copywriting coach named KareerPilot AI. 
Your goal is to write a highly compelling, personalized cold email and a matching LinkedIn direct message to a recruiter at ${company} for the target role of ${role}.

Your drafts MUST sound completely human, genuine, and authentic. 
CRITICAL RULE: Avoid any typical robotic AI clichés (do NOT use openers like "I hope this email finds you well", "I hope you are doing fantastic", or generic filler adjectives like "delve", "testament", "leverage", "robust", "beacon"). Instead, write with genuine interest, crisp sentence structures, and a direct human voice.

Use these specific parameters to shape the copy:
- Target Company: ${company}
- Target Role: ${role}
- Addressing Greeting: ${greeting}
- Tone style requested: ${tone} (Implement formal/conversational/bold depending on this value)
- Company Context (Why the candidate is excited): ${companyContext || "General interest in their reputation for shipping top-tier developer tools and engineering innovation"}
- Personal Notes/Context to highlight: ${userNotes || "CS student with experience building full-stack software, data structures, and shipping real features."}

Writing Tone Guides:
- "formal": Highly professional, polished, corporate but entirely authentic and respectful.
- "conversational": Friendly, warm, authentic, like a peer-to-peer developer connection.
- "bold": Impact-driven, confident, high energy, and direct about why they want to join.

Make sure the email copy has standard placeholders like [Your Name], [LinkedIn], [GitHub] so the user can easily fill their details.`;

  console.log(`Invoking Langchain Email Agent for ${company} - Role: ${role} [Tone: ${tone}]`);
  
  const response = await structuredLlm.invoke([
    { role: "system", content: systemInstruction },
    { role: "user", content: `Generate the customized outreach copies for ${role} position at ${company}.` }
  ]);

  return response;
}
