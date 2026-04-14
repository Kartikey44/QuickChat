import { resendClient } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    console.log("🚀 Sending email to:", email);

    const response = await resendClient.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome to Quickchat!",
      html: createWelcomeEmailTemplate(name, clientURL)
    });

    console.log("✅ RESEND RESPONSE:", response);

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
  }
};