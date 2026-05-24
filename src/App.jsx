import React, { useState } from 'react';
import Home from './pages/Home';
import './App.css';

function App() {
  const [theme, setTheme] = useState('night');

  const toggleTheme = () => {
    setTheme(prev => prev === 'night' ? 'day' : 'night');
  };

  return (
    <div className={`theme-${theme}`}>
      <Home theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;