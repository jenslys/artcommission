import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {user && (
              <Button
                color='inherit'
                onClick={() => {
                  navigate('/orders');
                }}
              >
                Orders
              </Button>
            )}
            {user && (
              <Button
                color='inherit'
                onClick={() => {
                  navigate('/requests');
                }}
              >
                Requests
              </Button>
            )}
          </Typography>
          <Typography variant='h6' component='div'>
            {!user && (
              <Button
                color='inherit'
                onClick={() => {
                  navigate('/login');
                }}
              >
                Login
              </Button>
            )}
            {user && (
              <Button color='inherit' onClick={logout}>
                Logout
              </Button>
            )}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
