import React from 'react';
import './App.css';
import LandingPage from './pages/LandingPage/LandingPage'
import SignInPage from './pages/SignInPage/SignInPage';
import { Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage/DashboardPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/signIn" element={<SignInPage />}/>
      <Route path="/dashboard" element={<DashboardPage />}/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
