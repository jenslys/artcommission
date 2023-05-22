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
  // create a custom theme for the app
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

function App() {
  const { user, authIsReady } = useAuthContext();
  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        {authIsReady && ( // wait for firebase to initialize before rendering the app
          <BrowserRouter>
            {user && <ResponsiveNav />}
            <Routes>
              <Route path='/' element={<Form />} />
              <Route
                path='/login'
                element={user ? <Navigate to='/requests' replace={true} /> : <Login />} // if the user is logged in, redirect to the requests page
              />
              <Route
                path='/requests'
                element={!user ? <Navigate to='/login' replace={true} /> : <Requests />} // if the user is not logged in, redirect to the login page
              />
              <Route
                path='/archive'
                element={!user ? <Navigate to='/login' replace={true} /> : <Archive />} // if the user is not logged in, redirect to the login page
              />
              <Route
                path='/orders'
                element={!user ? <Navigate to='/login' replace={true} /> : <Orders />} // if the user is not logged in, redirect to the login page
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
