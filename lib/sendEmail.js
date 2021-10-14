import nodemailer from 'nodemailer';

const sendMail = ({ to, subject, message }, isHtml) => new Promise((resolve, reject) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
  });

  let mailOptions = null;
  if (isHtml) {
    mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to,
      subject,
      generateTextFromHTML: true,
      html: message,
    };
  } else {
    mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to,
      subject,
      text: message,
    };
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      reject(error);
    } else {
      resolve(info);
    }
  });
});

export default sendMail;
