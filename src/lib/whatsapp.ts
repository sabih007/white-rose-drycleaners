import twilio from "twilio";

let client: ReturnType<typeof twilio> | null = null;

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  if (!client) client = twilio(sid, token);
  return client;
}

function toWhatsAppAddress(phone: string): string {
  if (phone.startsWith("+")) return `whatsapp:${phone}`;
  const defaultCountryCode = process.env.DEFAULT_COUNTRY_CODE || "92";
  return `whatsapp:+${defaultCountryCode}${phone.replace(/^0/, "")}`;
}

export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<{ sent: boolean; error?: string }> {
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  const whatsappClient = getClient();

  if (!whatsappClient || !from) {
    console.warn(
      "WhatsApp message not sent: Twilio is not configured (TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_WHATSAPP_NUMBER)."
    );
    return { sent: false, error: "Twilio WhatsApp not configured" };
  }

  try {
    await whatsappClient.messages.create({
      to: toWhatsAppAddress(to),
      from: `whatsapp:${from}`,
      body,
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send WhatsApp message", err);
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
