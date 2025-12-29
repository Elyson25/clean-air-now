const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter with the most explicit and robust settings for Gmail on a server.
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Use the direct hostname, not the 'service' shortcut
    port: 465,              // The standard SSL port for secure SMTP
    secure: true,           // Enforce a secure (SSL/TLS) connection from the start
    auth: {
      user: process.env.EMAIL_USER, // Your full Gmail address from .env
      pass: process.env.EMAIL_PASS, // Your 16-character App Password from .env
    },
    // Add a connection timeout to prevent the server from hanging for too long
    connectionTimeout: 10000, // 10 seconds
  });

  // 2. Define the email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email with detailed logging
  try {
    console.log('Attempting to send email via Gmail...');
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via Gmail. Message ID:', info.messageId);
  } catch (error) {
    // THIS IS THE MOST IMPORTANT LOG. It will print the exact technical error.
    console.error('--- NODEMAILER CRITICAL FAILURE ---');
    console.error('Nodemailer failed to send email. The error object is:', error);
    console.error('--- END OF ERROR ---');
    // Re-throw the error so the controller that called this function knows it failed
    throw new Error('Email could not be sent. Check server logs for detailed error.');
  }
};

module.exports = sendEmail;