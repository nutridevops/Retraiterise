import { NextResponse } from "next/server"
import { Resend } from "resend"
import EmailTemplate from "./email-template"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, phone, message } = data

    // Send the email using Resend with the React template
    const { data: emailData, error } = await resend.emails.send({
      from: "RISE Retreat <contact@riseretreat.com>", // You can customize this
      to: ["chris@codenutri.com", "info.neuroperformancetraining@gmail.com"],
      subject: `Nouveau message de ${name} - Formulaire RISE Retreat`,
      react: EmailTemplate({ name, email, phone, message }),
      replyTo: email,
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
