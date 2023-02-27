import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Page components
import Form from './pages/Form';
import Login from './pages/Login';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Form />} />
          <Route path='/Login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
