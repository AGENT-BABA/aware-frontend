import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AWSKeys from './pages/AWSKeys';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [hasKeys, setHasKeys] = useState(localStorage.getItem('hasKeys') === 'true');
  const navigate = useNavigate();

  const handleLogin = (newToken, keys) => {
    setToken(newToken);
    setHasKeys(keys);
    localStorage.setItem('token', newToken);
    localStorage.setItem('hasKeys', keys);
    if (!keys) {
      navigate('/aws-keys');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('hasKeys');
    setToken(null);
    setHasKeys(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white overflow-x-hidden custom-scrollbar">
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login onLogin={handleLogin} /> : <Navigate to={hasKeys ? "/dashboard" : "/aws-keys"} />} 
        />
        <Route 
          path="/signup" 
          element={!token ? <Signup /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/aws-keys" 
          element={token ? <AWSKeys onKeysSet={() => { setHasKeys(true); localStorage.setItem('hasKeys', 'true'); }} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? (hasKeys ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/aws-keys" />) : <Navigate to="/login" />} 
        />
        <Route 
          path="/billing" 
          element={token ? <Billing onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={token ? <Settings onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
