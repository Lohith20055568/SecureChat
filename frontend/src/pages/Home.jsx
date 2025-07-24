// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('otp_email');
    if (!storedEmail) navigate('/signin');
    else setEmail(storedEmail);
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="sidebar-top">
          <h2>Menu</h2>
          <button onClick={() => navigate('/verified-users')}>✅ Verified Users</button>
          <button onClick={() => navigate('/chat')}>💬 Chat</button>
        </div>

        <div className="sidebar-bottom">
          <button onClick={handleSignOut}>🚪 Sign Out</button>
        </div>
      </div>

      <div className="main-content">
        <h1>👋 Welcome, {email}</h1>
        <p>Select a menu item from the left to proceed.</p>
      </div>
    </div>
  );
};

export default Home;
