import React from 'react';
import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/LandingPage/LandingPage'
import SignInPage from './pages/SignInPage/SignInPage';
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/signIn" element={<SignInPage />}/>
    </Routes>
  );
}

export default App;
