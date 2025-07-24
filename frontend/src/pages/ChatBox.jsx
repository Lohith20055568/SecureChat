import './ChatBox.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';

const socket = io('http://localhost:5000'); // Your backend

const SECRET_KEY = 'securechat-key';

const ChatBox = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchVerifiedUsers();
    socket.on('receive-msg', (data) => {
      const decrypted = CryptoJS.AES.decrypt(data.message, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setMessages((prev) => [...prev, { from: data.from, message: decrypted }]);
    });
  }, []);

  const fetchVerifiedUsers = async () => {
    const res = await fetch('http://localhost:5000/api/auth/verified-users');
    const data = await res.json();
    setUsers(data.filter(u => u.username !== username));
  };

  const sendMessage = () => {
    if (!msg || !selectedUser) return;
    const encrypted = CryptoJS.AES.encrypt(msg, SECRET_KEY).toString();
    socket.emit('send-msg', {
      from: username,
      to: selectedUser,
      message: encrypted
    });
    setMessages((prev) => [...prev, { from: username, message: msg }]);
    setMsg('');
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Verified Users</h3>
        {users.map((u) => (
          <div key={u.username} className="user" onClick={() => {
            setSelectedUser(u.username);
            setMessages([]);
          }}>
            {u.username}
          </div>
        ))}
      </div>

      <div className="chat-box">
        <h3>Chat with {selectedUser || '...'}</h3>
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={m.from === username ? 'sent' : 'received'}>
              <b>{m.from}:</b> {m.message}
            </div>
          ))}
        </div>
        {selectedUser && (
          <div className="input-box">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type message..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
