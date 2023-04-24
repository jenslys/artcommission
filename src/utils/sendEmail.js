import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import CustomSnackbar from '../components/CustomSnackbar';

const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const userId = process.env.REACT_APP_EMAILJS_USER_ID;

//* to_name: name of the recipient
//* to_email: email of the recipient
//* message: message to be sent
//* from_name: name of the sender

const emailError = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const sendEmail = async (to_name, to_email, message, from_name) => {
    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        { to_name, to_email, message, from_name },
        userId,
      );

      if (response.status === 200) {
        // success
      }
    } catch (error) {
      // error
      return error;
    }
  };

  return (
    <div>
      <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} />
    </div>
  );
};

export default emailError;
