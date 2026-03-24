import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainApp from './components/screens/MainApp';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { LandingScreen } from './components/screens/LandingScreen';

function App() {
  return (
    <Routes>
      <Route path="/board" element={<LandingScreen />} />
      <Route path="/solo" element={<MainApp />} />
      <Route path="/game" element={<DashboardScreen />} />
    </Routes>
  );
}

export default App;
