import { google } from "googleapis"

export async function sendGmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const redirectUri = process.env.GMAIL_REDIRECT_URI || "https://developers.google.com/oauthplayground"
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN
  const from = process.env.GMAIL_FROM_EMAIL

  if (!clientId || !clientSecret || !refreshToken || !from) {
    throw new Error("Gmail not configured")
  }
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  oAuth2Client.setCredentials({ refresh_token: refreshToken })
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client })

  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
  ]
  const message = messageParts.join("\n")
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  })
  return res.data
}
