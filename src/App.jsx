import React from 'react';
import DuelCanvas from './DuelCanvas';
import Logo from './Logo/Logo'

import './App.css';

export const App = () => {
  return (
    <div className="App">
    <Logo />
    <DuelCanvas />
  </div>
  );
}

export default App;