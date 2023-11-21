import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './component/login';
import SignUp from './component/signup';
import Home from './component/home';
import EditNote from './component/edit.note';

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/register" element={<SignUp/>}/>
        <Route path="/edit/:note_id" element={<EditNote/>}/>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;