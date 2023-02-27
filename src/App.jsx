import './App.css'
import Register from '../components/register.jsx'
import Login from '../components/login.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedComponent from '../components/protectedComponent';
import { useState, useEffect } from 'react';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/protected" element={<ProtectedComponent loginData={name} />} />
      </Routes>
    </Router>
  );
}
export default App;
