const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: "Rapid Page Builder Support<rapid@gmail.com>",
    to: options.email,
    subject: "Blog publish reminder",
    html: options.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
