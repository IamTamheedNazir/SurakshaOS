import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';

// Pages
import ProfessionalHomePage from './pages/ProfessionalHomePage';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <route path="/" element={<ProfessionalHomePage />} />
          
          {/* More routes will be added */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
