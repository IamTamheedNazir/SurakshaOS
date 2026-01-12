import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import ProfessionalHomePage from './pages/ProfessionalHomePage';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProfessionalHomePage />} />
          
          {/* More routes will be added */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
