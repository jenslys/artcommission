import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, ExitToApp, RequestQuote, ShoppingCart } from '@mui/icons-material';
import logo_white from '../assets/logo_white.png';

export default function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Box
            component='img'
            sx={{
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
              mr: 4,
            }}
            alt='The house from the offer.'
            src={logo_white}
          />
          <Typography
            variant='regular'
            component='div'
            sx={{
              flexGrow: 2,
            }}
          >
            {user && (
              <Button
                color='inherit'
                startIcon={<RequestQuote />}
                onClick={() => {
                  navigate('/requests');
                }}
              >
                Requests
              </Button>
            )}
            {user && (
              <Button
                color='inherit'
                startIcon={<ShoppingCart />}
                sx={{ ml: 2 }}
                onClick={() => {
                  navigate('/orders');
                }}
              >
                Orders
              </Button>
            )}
          </Typography>
          <Typography
            variant='regular'
            component='div'
            sx={{
              flexGrow: 0,
            }}
          >
            {!user && (
              <Button
                color='inherit'
                startIcon={<AccountCircle />}
                onClick={() => {
                  navigate('/login');
                }}
              >
                Login
              </Button>
            )}
            {user && (
              <Button color='inherit' startIcon={<ExitToApp />} onClick={logout}>
                Logout
              </Button>
            )}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
