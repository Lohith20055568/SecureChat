import './Fingerprint.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FingerprintVerify = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('otp_email');
    if (!storedEmail) {
      alert("No email found for verification.");
      navigate('/signin');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleFingerprint = async () => {
    try {
      // Simulate fingerprint ID
      const fingerprintID = 'FP-' + Math.random().toString(36).substring(2, 10);

      await axios.post('http://localhost:5000/api/auth/verify-fingerprint', {
        email,
        fingerprintID,
      });

      alert('✅ Fingerprint Verified!');
      navigate('/home');
    //    navigate('/chat');
    } catch (err) {
      alert('❌ Fingerprint verification failed');
    }
  };

  return (
    <div className="fingerprint-container">
      <div className="fingerprint-box">
        <h2>Fingerprint Verification</h2>
        <p>Please verify your fingerprint to continue.</p>
        <button onClick={handleFingerprint}>Scan Fingerprint</button>
      </div>
    </div>
  );
};

export default FingerprintVerify;
