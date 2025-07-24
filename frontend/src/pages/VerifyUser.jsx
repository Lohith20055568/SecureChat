import { useState } from 'react';
import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function VerifyUser() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fingerprintID, setFingerprintID] = useState('');
  const [status, setStatus] = useState('');

  const sendOtp = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/auth/send-otp`, { email });
      setStatus(res.data.message);
    } catch (err) {
      setStatus('❌ Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/auth/verify-otp`, { email, otp });
      setStatus(res.data.message);
    } catch (err) {
      setStatus('❌ OTP verification failed');
    }
  };

  const submitFingerprint = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/auth/verify-fingerprint`, {
        email,
        fingerprintID,
      });
      setStatus(res.data.message);
    } catch (err) {
      setStatus('❌ Fingerprint verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold mb-4">🔐 Secure User Verification</h1>

      <input
        className="p-2 w-full max-w-md bg-gray-800 rounded"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={sendOtp}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Send OTP
      </button>

      <input
        className="p-2 w-full max-w-md bg-gray-800 rounded"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button
        onClick={verifyOtp}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        Verify OTP
      </button>

      <input
        className="p-2 w-full max-w-md bg-gray-800 rounded"
        placeholder="Enter Fingerprint ID"
        value={fingerprintID}
        onChange={(e) => setFingerprintID(e.target.value)}
      />
      <button
        onClick={submitFingerprint}
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
      >
        Submit Fingerprint
      </button>

      {status && <p className="mt-4 text-yellow-400">{status}</p>}
    </div>
  );
}
