import twilio from "twilio";

let client: ReturnType<typeof twilio> | null = null;

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  if (!client) client = twilio(sid, token);
  return client;
}

export async function sendSms(
  to: string,
  body: string
): Promise<{ sent: boolean; error?: string }> {
  const from = process.env.TWILIO_PHONE_NUMBER;
  const smsClient = getClient();

  if (!smsClient || !from) {
    console.warn("SMS not sent: Twilio is not configured (TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_PHONE_NUMBER).");
    return { sent: false, error: "Twilio not configured" };
  }

  try {
    await smsClient.messages.create({ to, from, body });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send SMS", err);
    return { sent: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
