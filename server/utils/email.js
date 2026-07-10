const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Sanitizes and trims environment variables to prevent copy-paste newlines/whitespace errors
const getEmailConfig = () => {
  const host = (process.env.EMAIL_HOST || "smtp.gmail.com").trim();
  const port = parseInt((process.env.EMAIL_PORT || "587").trim());
  const secure = (process.env.EMAIL_SECURE || "false").trim() === "true";
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").trim();
  const from = (process.env.EMAIL_FROM || user).trim();
  return { host, port, secure, user, pass, from };
};

const config = getEmailConfig();

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  family: 4, // Force IPv4
  auth: {
    user: config.user,
    pass: config.pass,
  },
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  const html = `
    <h2>Hi ${userName}!</h2>
    <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
    <p>Thank you for choosing Eventora.</p>
  `;

  // 1. If using Resend API Key, send via HTTPS API on Port 443
  if (config.pass.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.pass}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.from || "onboarding@resend.dev",
          to: userEmail,
          subject: `Booking Confirmed: ${eventTitle}`,
          html: html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[RESEND API] Booking email sent successfully to ${userEmail}. ID: ${data.id}`);
        return;
      } else {
        console.error("[RESEND API ERROR]", data);
      }
    } catch (error) {
      console.error("Error sending booking email via Resend HTTPS API:", error);
    }
  }

  // 2. If using Brevo API Key, send via HTTPS API on Port 443 (allows sending to anyone for free without domain)
  if (config.pass.startsWith("xsmtpsib-")) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": config.pass,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: config.from },
          to: [{ email: userEmail }],
          subject: `Booking Confirmed: ${eventTitle}`,
          htmlContent: html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[BREVO API] Booking email sent successfully to ${userEmail}. ID: ${data.messageId}`);
        return;
      } else {
        console.error("[BREVO API ERROR]", data);
      }
    } catch (error) {
      console.error("Error sending booking email via Brevo HTTPS API:", error);
    }
  }

  // 3. Fallback to standard SMTP
  try {
    const mailOptions = {
      from: config.from,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: html,
    };
    await transporter.sendMail(mailOptions);
    console.log("[SMTP] Email sent successfully to", userEmail);
  } catch (error) {
    console.error("[SMTP ERROR] Error sending email:", error);
  }
};

const sendOTPEmail = async (userEmail, otp, type) => {
  const title =
    type === "account_verification"
      ? "Verify your Eventora Account"
      : "Eventora Booking Verification";
  const msg =
    type === "account_verification"
      ? "Please use the following OTP to verify your new Eventora account."
      : "Please use the following OTP to verify and confirm your event booking.";

  const html = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #111;">${title}</h2>
        <p style="color: #555; font-size: 16px;">${msg}</p>
        <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
            ${otp}
        </div>
        <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
    </div>
  `;

  // 1. If using Resend API Key, send via HTTPS API on Port 443
  if (config.pass.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.pass}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.from || "onboarding@resend.dev",
          to: userEmail,
          subject: title,
          html: html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[RESEND API] OTP email sent successfully to ${userEmail}. ID: ${data.id}`);
        return;
      } else {
        console.error("[RESEND API ERROR]", data);
      }
    } catch (error) {
      console.error("Error sending OTP email via Resend HTTPS API:", error);
    }
  }

  // 2. If using Brevo API Key, send via HTTPS API on Port 443 (allows sending to anyone for free without domain)
  if (config.pass.startsWith("xsmtpsib-")) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": config.pass,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: config.from },
          to: [{ email: userEmail }],
          subject: title,
          htmlContent: html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[BREVO API] OTP email sent successfully to ${userEmail}. ID: ${data.messageId}`);
        return;
      } else {
        console.error("[BREVO API ERROR]", data);
      }
    } catch (error) {
      console.error("Error sending OTP email via Brevo HTTPS API:", error);
    }
  }

  // 3. Fallback to standard SMTP
  try {
    const mailOptions = {
      from: config.from,
      to: userEmail,
      subject: title,
      html: html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`[SMTP] OTP sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.error("[SMTP ERROR] Error sending OTP email:", error);
  }
};

module.exports = { sendBookingEmail, sendOTPEmail };
