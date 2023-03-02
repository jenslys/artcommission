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

export default function FormCreation() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
    city: '',
    size: '100x100',
    description: '',
    status: 'new',
    stage: 'requests',
  });
  const dbRef = collection(db, 'orders');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    // Need connection to db
    addDoc(dbRef, formData).catch((error) => {
      console.log(error);
    });
  };

  const sizes = [
    {
      value: '100x100',
      label: '100x100',
    },
    {
      value: '150x150',
      label: '150x150',
    },
    {
      value: '200x200',
      label: '200x200',
    },
    {
      value: '200x100',
      label: '200x100',
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
              '& .MuiTextField-root': { m: 1, width: '700px' },
            }}
            noValidate
            autoComplete='off'
          >
            <p>
              You need to fill in this form so i can see what you want me to make.<br></br> I will
              recive your request and you will get an answer within a week.
            </p>
            <TextField
              id='firstname'
              name='firstName'
              label='First Name'
              variant='outlined'
              type='text'
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
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
              type='text'
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
              id='size'
              name='size'
              select
              label='Select'
              defaultValue='100x100'
              helperText='Please select canvas size'
              value={formData.size}
              onChange={handleChange}
            >
              {sizes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id='description'
              name='description'
              label='Brief description of what you want made...'
              multiline
              rows={10}
              defaultValue='Description'
              value={formData.description}
              onChange={handleChange}
            />
            <Stack spacing={2} direction='row'>
              <Button variant='outlined' type='cancel' href='https://artbymuland.no/'>
                cancel
              </Button>

              <Button variant='contained' type='submit' onClick={handleSubmit}>
                Submit
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
