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
      You are an Expert Business Intelligence Agent. 
      Analyze this CSV data (JSON): ${JSON.stringify(csvData.slice(0, 300))}

      Provide a high-level analysis with these exact sections:
      
      1. **Predictive Trend**: Based on the patterns (dates, numbers, or categories), what is the most likely outcome for the next 30 days? Be specific.
      
      2. **Actionable Step**: Provide ONE "High-Impact" recommendation. What should the user do TODAY to improve these results?
      
      3. **Data Visualization Map**: Suggest which columns would be best to plot on a Chart (e.g., "Date" on X-axis, "Amount" on Y-axis).

      Keep the response professional, concise, and formatted in clean Markdown.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    
    return NextResponse.json({ summary: response.text() });
  } catch (error: any) {
    console.error("Agent Error:", error);
    return NextResponse.json({ error: "Agent failed to think: " + error.message }, { status: 500 });
  }
}