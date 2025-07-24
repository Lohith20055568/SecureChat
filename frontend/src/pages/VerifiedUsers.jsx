// // src/pages/VerifiedUsers.jsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import BackButton from "../components/BackButton";
// import './VerifiedUsers.css';

// const VerifiedUsers = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchVerifiedUsers = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/auth/verified-users');
//         setUsers(res.data);
//       } catch (err) {
//         console.error('Error fetching verified users:', err);
//       }
//     };

//     fetchVerifiedUsers();
//   }, []);

//   return (
//     <div className="verified-users-container">
//     <BackButton />
//       <h2>✅ Verified Online Users</h2>
//       {users.length === 0 ? (
//         <p>No verified users online.</p>
//       ) : (
//         <ul>
//           {users.map((user, i) => (
//             <li key={i}>
//               <strong>{user.username}</strong> ({user.email})
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default VerifiedUsers;
// src/pages/VerifiedUsers.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from "../components/BackButton";
import './VerifiedUsers.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const VerifiedUsers = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const currentUserEmail = localStorage.getItem('username'); // assuming 'username' stores email

  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/verified-users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching verified users:', err);
      }
    };

    fetchVerifiedUsers();
  }, []);

  useEffect(() => {
    if (currentUserEmail) {
      socket.emit('go-online', currentUserEmail);
    }

    socket.on('online-users', (emails) => {
      setOnlineUsers(emails);
    });

    return () => {
      socket.off('online-users');
    };
  }, [currentUserEmail]);

  return (
    <div className="verified-users-container">
      <BackButton />
      <h2>✅ Verified Online Users</h2>
      {users.length === 0 ? (
        <p>No verified users available.</p>
      ) : (
        <ul>
          {users.map((user, i) => (
            <li key={i} className="user-item">
              <strong>{user.username}</strong> ({user.email})
              <span className={`status-badge ${onlineUsers.includes(user.email) ? 'online' : 'offline'}`}>
                {onlineUsers.includes(user.email) ? '🟢 Online' : '🔴 Offline'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VerifiedUsers;
