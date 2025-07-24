import './Auth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Authenticate user
      const res = await axios.post('http://localhost:5000/api/auth/signin', form);

      // Step 2: Save token and username
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('otp_email', form.email); // Needed for OTP verify

      // Step 3: Send OTP
      await axios.post('http://localhost:5000/api/auth/send-otp', {
        email: form.email,
      });

      alert('OTP sent to your email');
      navigate('/verify-otp');
    } catch (err) {
      alert(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Signin</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
        <p>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')}>Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default Signin;
