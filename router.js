import React, { useState } from 'react';
import Login from './components/login.js';
import Home from './components/home.js';

export default function Router() {
  const [screen, setScreen] = useState('login');

  return (
    <>
      {screen === 'login' && (
        <Login
          onSwitch={() => setScreen('register')} // si luego agregas registro
          onLogin={() => setScreen('home')}      // si luego agregas home
        />
      )}
      {screen === 'home' && <Home />}
    </>
  );
}
