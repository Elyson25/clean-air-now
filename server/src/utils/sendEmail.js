const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter with explicit, production-ready settings for Gmail.
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email and provide detailed logging
  try {
    console.log('Attempting to send email with nodemailer...');
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId);
  } catch (error) {
    // THIS IS THE MOST IMPORTANT LOG. It will print the exact error from Google.
    console.error('--- NODEMAILER CRITICAL ERROR ---');
    console.error(error);
    console.error('--- END NODEMAILER ERROR ---');
    throw new Error('Email could not be sent. Check server logs for details.');
  }
};

module.exports = sendEmail;