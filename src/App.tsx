import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainApp from './components/screens/MainApp';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { LandingScreen } from './components/screens/LandingScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="/main" element={<MainApp />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
    </Routes>
  );
}

export default App;
