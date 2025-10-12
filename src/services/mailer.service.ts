import nodemailer from "nodemailer";
import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";
import config from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

interface EmailParams {
  to: string;
  name: string;
  otp: string;
}

export const sendOtpEmail = async ({ to, name, otp }: EmailParams) => {
  const html = pug.renderFile(path.join(__dirname, "../views/email/otp.pug"), {
    name,
    otp,
  });

  const mailOptions = {
    from: `YourApp <${config.mail.from}>`,
    to,
    subject: "Your One-Time Password (OTP)",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

export const sendPasswordResetEmail = async ({
  to,
  name,
  otp,
}: EmailParams) => {
  const html = pug.renderFile(
    path.join(__dirname, "../views/email/resetPassword.pug"),
    {
      name,
      otp,
    }
  );

  const mailOptions = {
    from: `YourApp <${config.mail.from}>`,
    to,
    subject: "Your Password Reset Code",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};
