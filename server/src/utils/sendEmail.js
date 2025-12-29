const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter configured for Gmail with more explicit options.
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Use the direct hostname for Gmail
    port: 465,              // Use the standard SSL port
    secure: true,           // Use a secure connection
    auth: {
      user: process.env.EMAIL_USER, // Your full Gmail address from .env
      pass: process.env.EMAIL_PASS, // Your 16-character App Password from .env
    },
  });

  // Define the email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email and log the result
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Real email sent successfully. Message ID:', info.messageId);
  } catch (error) {
    console.error('CRITICAL: Error sending real email:', error);
    // Re-throw the error so the controller that called this function knows it failed
    throw new Error('Email could not be sent due to a server configuration issue.');
  }
};

module.exports = sendEmail;