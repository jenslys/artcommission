// sendEmail.js
import emailjs from '@emailjs/browser';

const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const userId = process.env.REACT_APP_EMAILJS_USER_ID;

//* to_name: name of the recipient
//* to_email: email of the recipient
//* message: message to be sent
//* from_name: name of the sender

export const sendEmail = async (to_name, to_email, message, from_name) => {
  try {
    return await emailjs.send(
      serviceId,
      templateId,
      { to_name, to_email, message, from_name },
      userId,
    );
  } catch (error) {
    console.error('Failed to send email. Error: ', error);
    return error;
  }
};

export default sendEmail;
