const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Determine if we should use Mailtrap or fall back to Gmail depending on what you configured on Render
  const isMailtrap = process.env.EMAIL_SERVICE === 'mailtrap' || !process.env.EMAIL_SERVICE;

  const transporterConfig = isMailtrap
    ? {
        // ─── PRODUCTION MAILTRAP RE-ROUTING GATEWAY ───
        host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: parseInt(process.env.EMAIL_PORT) || 2525,
        secure: false, // Mailtrap sandbox doesn't expect secure true on port 2525
        auth: {
          user: process.env.EMAIL_USER, // Will read your Mailtrap Username token from Render
          pass: process.env.EMAIL_PASS, // Will read your Mailtrap Password string from Render
        },
        connectionTimeout: 10000,
      }
    : {
        // ─── LOCAL FALLBACK OR REAL SMTP DIRECT GMAIL GATES ───
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 465,
        secure: process.env.EMAIL_PORT == '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
      };

  const transporter = nodemailer.createTransport(transporterConfig);

  // Define the email content payload structure
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Clean Air Now <noreply@cleanairnow.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Dispatch message execution loop with descriptive live log reporting
  try {
    console.log(`Attempting transaction routing via engine: ${isMailtrap ? 'Mailtrap Sandbox' : 'Direct SMTP Gmail'}`);
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email dispatched successfully. Message Transaction ID: ${info.messageId}`);
  } catch (error) {
    console.error('--- NODEMAILER CRITICAL FAILURE ---');
    console.error('Nodemailer system failed to transmit message payload:', error);
    console.error('--- END OF ERROR ---');
    throw new Error('Email transit crashed. Please review active backend orchestration configs.');
  }
};

module.exports = sendEmail;
