import { NextResponse } from "next/server"
import { Resend } from "resend"
import EmailTemplate from "./email-template"

// Initialize Resend with your API key or a placeholder for build time
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder_for_build'
const resend = new Resend(resendApiKey)

export async function POST(request: Request) {
  try {
    // Check if we have a real API key before proceeding
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder_for_build') {
      console.error("Missing Resend API key in environment variables")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }
    
    const data = await request.json()
    const { name, email, phone, message } = data

    // Send the email using Resend with the React template
    // Using type assertion to handle different Resend API versions
    // Local environment might expect 'replyTo' while deployment environment expects 'reply_to'
    const { data: emailData, error } = await resend.emails.send({
      from: "RISE Retreat <contact@riseretreat.com>", // You can customize this
      to: ["chris@codenutri.com", "info.neuroperformancetraining@gmail.com"],
      subject: `Nouveau message de ${name} - Formulaire RISE Retreat`,
      react: EmailTemplate({ name, email, phone, message }),
      ...(email ? { replyTo: email } : {}),
    })

    if (error) {
      console.error("Error sending email:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("Email sent successfully:", emailData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
