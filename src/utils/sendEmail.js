import emailjs from '@emailjs/browser';

const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const userId = process.env.REACT_APP_EMAILJS_USER_ID;

const sendEmail = async (to_name, to_email, message, from_name) => {
  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      { to_name, to_email, message, from_name },
      userId,
    );

    if (response.status === 200) {
      console.log('Successfully sent email.');
    }
  } catch (error) {
    console.error('Failed to send email. Error: ', error);
  }
};

export default sendEmail;
