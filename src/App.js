import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Page components
import Form from './pages/Form';
import Login from './pages/Login';
import Requests from './pages/Requests';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Archive from './pages/Archive';

function App() {
  const { user, authIsReady } = useAuthContext();
  return (
    <div className='App'>
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Form />} />
            <Route
              path='/login'
              element={user ? <Navigate to='/requests' replace={true} /> : <Login />}
            />
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
  );
}

export default App;
