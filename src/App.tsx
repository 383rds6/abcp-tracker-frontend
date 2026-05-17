import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL params after Whoop OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const urlUserId = params.get('userId');
    const success = params.get('success');
    const error = params.get('error');

    if (urlUserId && success) {
      localStorage.setItem('whoopUserId', urlUserId);
      setUserId(urlUserId);
      window.history.replaceState({}, '', '/');
    } else if (error) {
      console.error('Auth error:', error);
      window.history.replaceState({}, '', '/');
    } else {
      const stored = localStorage.getItem('whoopUserId');
      if (stored) setUserId(stored);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('whoopUserId');
    setUserId(null);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--black)' }}>
      <div style={{ color:'var(--green)', fontFamily:'Bebas Neue', fontSize:'32px', letterSpacing:'0.1em' }}>LOADING...</div>
    </div>
  );

  if (!userId) return <LoginPage />;
  return <Dashboard userId={userId} onLogout={handleLogout} />;
}
