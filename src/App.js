import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Page components
import Form from './pages/Form';
import Login from './pages/Login';

function App() {
  const { user, authIsReady } = useAuthContext();
  return (
    <div className='App'>
      {authIsReady && (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Form />} />
            <Route
              path='/Login'
              element={user ? <Navigate to='/requests' replace={true} /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
