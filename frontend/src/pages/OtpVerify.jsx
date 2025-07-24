import './Otp.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('otp_email');
    if (storedEmail) setEmail(storedEmail);

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });
      alert('✅ OTP Verified!');
      navigate('/fingerprint');
    } catch (err) {
      console.error('❌ OTP Verify Error:', err.response?.data || err.message);
      alert('❌ Invalid or Expired OTP');
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      alert('🔁 OTP resent successfully!');
      setTimer(60);
    } catch (err) {
      console.error('❌ Resend OTP Error:', err.response?.data || err.message);
      alert('❌ Failed to resend OTP');
    }
  };

  return (
    <div className="otp-container">
      <form className="otp-box" onSubmit={handleVerify}>
        <h2>🔐 Enter OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          required
        />
        <button type="submit">Verify OTP</button>
        <p className="timer">⏳ Time left: {timer}s</p>
        <p className="resend">
          Didn't get OTP?{' '}
          <span
            onClick={timer === 0 ? resendOtp : null}
            style={{
              color: timer === 0 ? 'blue' : 'gray',
              cursor: timer === 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Resend
          </span>
        </p>
      </form>
    </div>
  );
};

export default OtpVerify;
