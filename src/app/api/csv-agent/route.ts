import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { csvData, userQuestion } = await request.json();

    // 1. Initialize Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Create the "System Instruction"
    const systemPrompt = `
      You are a professional Data Analyst Agent. 
      I will provide you with data from a CSV file in JSON format.
      
      DATA: ${JSON.stringify(csvData.slice(0, 100))} // Sending first 100 rows for analysis

      YOUR TASK:
      ${userQuestion 
        ? `Answer this specific question concisely: ${userQuestion}` 
        : "Provide a crisp, 3-bullet point summary of the key trends in this data."
      }

      Keep the tone professional and the output in clean Markdown.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    
    return NextResponse.json({ summary: response.text() });
  } catch (error: any) {
    console.error("Agent Error:", error);
    return NextResponse.json({ error: "Agent failed to think: " + error.message }, { status: 500 });
  }
}