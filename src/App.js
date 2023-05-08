import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { createTheme } from '@mui/material/styles';
import '@fontsource/montserrat';

// Page components
import Form from './pages/Form';
import Login from './pages/Login';
import Requests from './pages/Requests';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import ResponsiveNav from './components/ResponsiveNav';
import Archive from './pages/Archive';
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#f1f1f1',
    },
    error: {
      main: '#ea332a',
    },
  },
});

function ExternalRedirect() {
  // Here we redirect to studio, if we are logging in from the main site
  if (document.referrer == 'artbymuland.no') {
    window.location.href = 'https://studio.artbymuland.no/requests';
  } else {
    return <Navigate to='/requests' replace={true} />;
  }
  return null;
}

function App() {
  const { user, authIsReady } = useAuthContext();
  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        {authIsReady && (
          <BrowserRouter>
            {user && <ResponsiveNav />}
            <Routes>
              <Route path='/' element={<Form />} />
              <Route path='/login' element={user ? <ExternalRedirect /> : <Login />} />
              <Route
                path='/requests'
                element={!user ? <Navigate to='/login' replace={true} /> : <Requests />}
              />
              <Route
                path='/archive'
                element={!user ? <Navigate to='/login' replace={true} /> : <Archive />}
              />
              <Route
                path='/orders'
                element={!user ? <Navigate to='/login' replace={true} /> : <Orders />}
              />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
