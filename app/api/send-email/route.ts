import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a production environment, you would use a service like SendGrid, Mailgun, etc.
    // to send the email to info.neuroperformancetraining@gmail.com

    console.log("Sending email to: info.neuroperformancetraining@gmail.com")
    console.log("Form data:", data)

    // Simulate successful email sending
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

