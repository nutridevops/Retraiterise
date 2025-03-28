interface EmailTemplateProps {
  name: string
  email: string
  phone?: string
  message: string
}

// Changed to default export
export default function EmailTemplate({ name, email, phone, message }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#333" }}>
      <h1 style={{ color: "#0A291C", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>
        Nouveau message du formulaire RISE Retreat
      </h1>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Nom:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        {phone && (
          <p>
            <strong>Téléphone:</strong> {phone}
          </p>
        )}
      </div>

      <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#f9f9f9", borderLeft: "4px solid #D4AF37" }}>
        <h2 style={{ color: "#0A291C", marginTop: 0 }}>Message:</h2>
        <p style={{ whiteSpace: "pre-line" }}>{message}</p>
      </div>

      <div
        style={{ marginTop: "30px", fontSize: "12px", color: "#666", borderTop: "1px solid #eee", paddingTop: "10px" }}
      >
        <p>Ce message a été envoyé depuis le formulaire de contact du site RISE Retreat.</p>
      </div>
    </div>
  )
}

