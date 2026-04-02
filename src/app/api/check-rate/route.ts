import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: Request) {
  // 1. Check the secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

// Check for your manual secret OR the Vercel Cron Header
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isManualAuth = secret === process.env.CRON_SECRET;

  if (!isVercelCron && !isManualAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const apiKey = process.env.CURRENCY_API_KEY;

    // -----------------------------
    // 2. Fetch USD → INR
    // -----------------------------
    const inrRes = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );

    if (!inrRes.ok) throw new Error('Currency API failed');

    const inrData = await inrRes.json();
    const rateINR = inrData.conversion_rates.INR.toFixed(2);

    // -----------------------------
    // 3. Fetch USD → CAD
    // -----------------------------
    const cadRes = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );

    if (!cadRes.ok) throw new Error('Currency API failed (CAD)');

    const cadData = await cadRes.json();
    const rateCAD = cadData.conversion_rates.CAD.toFixed(2);

    // -----------------------------
    // 4. Setup Email Transporter
    // -----------------------------
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // -----------------------------
    // 5. Send Email
    // -----------------------------
    await transporter.sendMail({
      from: `"Dollar Agent" <${process.env.GMAIL_USER}>`,
      to: "meghapandit87@gmail.com",
      cc: "niteshpandit@gmail.com",
      subject: `💰 Agent Report: ₹${rateINR} | C$${rateCAD}`,
      text: `Your automated agent check:
1 USD = ₹${rateINR} INR
1 USD = C$${rateCAD} CAD`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">Dollar Rate Update</h2>

          <div style="margin-top: 10px;">
            <p style="font-size: 20px; font-weight: bold;">🇺🇸 → 🇮🇳</p>
            <p style="font-size: 24px; font-weight: bold;">$1 USD = ₹ ${rateINR} INR</p>
          </div>

          <div style="margin-top: 20px;">
            <p style="font-size: 20px; font-weight: bold;">🇺🇸 → 🇨🇦</p>
            <p style="font-size: 24px; font-weight: bold;">$1 USD = C$ ${rateCAD} CAD</p>
          </div>

          <p style="color: #666; margin-top: 20px;">Your agent successfully checked both rates and sent this update.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent and both rates fetched!',
      inr: rateINR,
      cad: rateCAD,
    });

  } catch (error: any) {
    console.error('Agent Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}