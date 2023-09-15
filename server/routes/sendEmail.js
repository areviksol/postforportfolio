import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'arevmkrtich@gmail.com',
      pass: 'wwfx dify dcqn ewnu', 
    },
  });
};

const sendEmail = async (email, subject, text) => {
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: 'arevmkrtich@gmail.com',
      to: email, 
      subject: subject,
      text: text,
    });

    console.log('Email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

export default sendEmail