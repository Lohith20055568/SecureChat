import { useEffect, useState } from 'react';
import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function UsersList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/auth/verified-users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🧑‍🤝‍🧑 Verified & Online Users</h1>

      <div className="grid gap-4 max-w-xl mx-auto">
        {users.length === 0 && (
          <p className="text-center text-gray-400">No users online yet.</p>
        )}
        {users.map((user) => (
          <div
            key={user.email}
            className="bg-gray-800 p-4 rounded-xl flex items-center justify-between shadow"
          >
            <div>
              <h3 className="font-semibold text-lg">{user.email}</h3>
              <p className="text-sm text-gray-400">
                Fingerprint: {user.fingerprintID || 'Not Available'}
              </p>
            </div>
            <span className="text-green-400 font-medium">🟢 Online</span>
          </div>
        ))}
      </div>
    </div>
  );
}
