// backend/utils/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // your Gmail
      pass: process.env.EMAIL_PASS,  // your Gmail App Password
    },
  });

  await transporter.sendMail({
    from: `"SecureChat App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP for SecureChat',
    text: `Your OTP is: ${otp}`,
  });
};
