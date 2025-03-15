

// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AnimalsPage from './components/AnimalsPage';
import AnimalDetailPage from './components/AnimalDetailPage';
import ModeratorDashboard from './components/ModeratorDashboard';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/animals" element={<AnimalsPage />} />
      <Route path="/animals/:id" element={<AnimalDetailPage />} />
      <Route path="/moderator" element={<ModeratorDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
