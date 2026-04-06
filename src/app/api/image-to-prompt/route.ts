import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { image } = await request.json(); // Base64 string from the frontend

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this image in extreme detail. 
      Write a highly descriptive 'Text-to-Image' prompt that would allow an AI (like Midjourney or DALL-E) to recreate this exact style, lighting, composition, and subject.
      
      Include:
      1. Subject description.
      2. Artistic style (e.g., photorealistic, 3d render, oil painting).
      3. Lighting and Color Palette.
      4. Camera angle and lens details.
      
      Output ONLY the final prompt text.
    `;

    // Gemini expects the image in a specific parts format
    const imagePart = {
      inlineData: {
        data: image.split(",")[1], // Remove the "data:image/png;base64," prefix
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    return NextResponse.json({ prompt: response.text() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}