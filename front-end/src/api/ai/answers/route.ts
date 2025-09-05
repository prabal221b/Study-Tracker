import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";


export async function POST(req: Request) {
  const { courseTitle, difficulty, totalHrs, dailyHrs } = await req.json();

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a detailed, ${difficulty}-level study roadmap for learning "${courseTitle}" over a total of ${totalHrs} hours, assuming the learner studies ${dailyHrs} hours per day.

🟡 Output format:
Return ONLY a valid JSON object in the following exact format (no markdown, no extra commentary):

{
  "technology_name": "${courseTitle}",
  "roadmap": [
    {
      "day": "1",
      "title": "Topic Title Here",
      "description": "Brief but specific explanation of what the user will learn.",
      "video": "https://...",
      "article": "https://..."
    },
    {
      "day": "2",
      "title": "Next Topic Title",
      "description": "Description of what will be covered on day 2.",
      "video": "https://...",
      "article": "https://..."
    }
    // Continue until all days are filled based on totalHrs and dailyHrs
  ]
}

🟠 Requirements:
•⁠  ⁠Use snake_case for all JSON keys.
•⁠  ⁠The "roadmap" array should contain one entry per day. Calculate number of days as: total_days = Math.ceil(totalHrs / dailyHrs).
•⁠  ⁠Each day's content should cover a unique topic relevant to ${courseTitle}, progressing from basic to advanced (according to the selected difficulty).
•⁠  ⁠Each day must include a valid and relevant *video* and *article* link (prefer YouTube, MDN, freeCodeCamp, W3Schools, official docs, etc).
•⁠  ⁠Ensure the content matches the selected difficulty level (${difficulty}).
•⁠  ⁠Do not repeat topics.
•⁠  ⁠Keep descriptions short, clear, and instructional.
•⁠  ⁠Output STRICTLY valid JSON. No extra formatting, no markdown, no commentary.

  `,
      system:
        "You are a helpful study assistant, speciliazing in created well formed roadmaps for learning technologies and you known to have the best possible resources for learning. Use the given syntax for generating the roadmap.",
    });

    return Response.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    
  }
}
