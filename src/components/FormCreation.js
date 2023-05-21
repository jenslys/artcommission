import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import 'firebase/firestore';
import { db } from '../firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import CustomSnackbar from './CustomSnackbar';

import sendEmail from '../utils/sendEmail';

export default function FormCreation() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    zipCode: '',
    city: '',
    size: '54x65',
    description: '',
    status: 'new',
    stage: 'requests',
    archived: 'false',
    date: new Date().toLocaleString(),
  });
  const dbRef = collection(db, 'requests');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSnackOpen = () => {
    setOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      formData.firstName === '' ||
      formData.lastName === '' ||
      formData.email === '' ||
      formData.address === '' ||
      formData.zipCode === '' ||
      formData.city === '' ||
      formData.size === '' ||
      formData.description === ''
    ) {
      setMessage('Please fill in all required fields');
      setSeverity('error');
      handleSnackOpen();
      return;
    } else {
      addDoc(dbRef, formData) // Add document to firestore
        .then(() => {
          setMessage('Request sent successfully');
          setSeverity('success');
          handleSnackOpen();
          sendEmail(
            // Send email to admin
            process.env.REACT_APP_ADMIN_NAME,
            process.env.REACT_APP_ADMIN_EMAIL,
            'New request from ' + formData.firstName + ' ' + formData.lastName,
            window.location.hostname,
          );
          sendEmail(
            // Send email to user
            formData.firstName,
            formData.email,
            'Your request has been received! I will now look through your request. You will eventually receive an email about the further process with your application..',
            process.env.REACT_APP_ADMIN_NAME,
          );
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            zipCode: '',
            city: '',
            size: '54x65',
            description: '',
          });
        })

        .catch((error) => {
          setMessage(error);
          setSeverity('error');
          handleSnackOpen();
        });
    }
  };

  const sizes = [
    {
      value: '54x65',
      label: '54x65',
    },
    {
      value: '73x92',
      label: '73x92',
    },
    {
      value: '81x100',
      label: '81x100',
    },
    {
      value: '89x116',
      label: '89x116',
    },
  ];

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Box
            component='form'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              '& .MuiTextField-root': { m: 1, width: '75%' },
            }}
            noValidate
            autoComplete='off'
          >
            <p>
              You need to fill out this form so I can see what you want me to make.<br></br> I will
              receive your request and you will get an answer within a week.
            </p>
            <TextField
              required
              id='firstname'
              name='firstName'
              label='First Name'
              variant='outlined'
              type='text'
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              required
              id='lastname'
              name='lastName'
              label='Last Name'
              variant='outlined'
              type='text'
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              required
              id='email'
              name='email'
              label='Email'
              variant='outlined'
              type='email'
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              required
              id='address'
              name='address'
              label='Address'
              variant='outlined'
              type='text'
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              required
              id='zipcode'
              name='zipCode'
              label='Zip Code'
              variant='outlined'
              type='number'
              value={formData.zipCode}
              onChange={handleChange}
            />
            <TextField
              required
              id='city'
              name='city'
              label='City'
              variant='outlined'
              type='text'
              value={formData.city}
              onChange={handleChange}
            />
            <TextField
              required
              id='size'
              name='size'
              select
              label='Please select canvas size'
              defaultValue='100x100'
              value={formData.size}
              onChange={handleChange}
            >
              {sizes.map(
                (
                  option, // Map through sizes array and create a MenuItem for each size
                ) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              required
              id='description'
              name='description'
              label='Brief description of what you want made...'
              multiline
              rows={10}
              defaultValue='Description'
              value={formData.description}
              onChange={handleChange}
            />
            <Stack marginTop={2} spacing={4} direction='row'>
              <Button
                variant='outlined'
                disableElevation
                size='large'
                type='cancel'
                href='https://artbymuland.no'
              >
                Cancel
              </Button>

              <Button
                variant='contained'
                disableElevation
                size='large'
                type='submit'
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </Paper>
        <CustomSnackbar
          open={open}
          onClose={handleSnackClose}
          severity={severity}
          message={message}
        />
      </Container>
    </React.Fragment>
  );
}
