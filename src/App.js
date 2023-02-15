import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

// Page components
import Form from './pages/Form';
import SignIn from './pages/SignIn';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/SignIn" element={<SignIn />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
