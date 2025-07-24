// // import { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import BackButton from '../components/BackButton';
// // import './ChatPage.css';
// // import { generateAESKey, encryptText, decryptText } from '../utils/aesUtils';
// // // ChatPage.jsx
// // import { decryptText } from '../utils/aesUtils';


// // const ChatPage = () => {
// //   const [verifiedUsers, setVerifiedUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [message, setMessage] = useState('');
// //   const [chat, setChat] = useState([]);

// //   const currentUser = localStorage.getItem('username');
// //   const currentEmail = localStorage.getItem('otp_email');

// //   console.log("✅ Current Username:", currentUser);
// //   console.log("✅ Current Email:", currentEmail);

// //   // ✅ Fetch verified users from backend (excluding self)
// //   useEffect(() => {
// //     const fetchVerifiedUsers = async () => {
// //       try {
// //         const res = await axios.get('http://localhost:5000/api/users/verified');
// //         const others = res.data.filter(user => user.email !== currentEmail);
// //         setVerifiedUsers(others);
// //       } catch (error) {
// //         console.error('🔴 Error fetching verified users:', error.message);
// //       }
// //     };

// //     if (currentEmail) {
// //       fetchVerifiedUsers();
// //     }
// //   }, [currentEmail]);

// //   // ✅ Fetch chat history between selected user and current user
// //   useEffect(() => {
// //     const fetchChat = async () => {
// //       if (!selectedUser || !currentEmail) return;
// //       try {
// //         const res = await axios.get('http://localhost:5000/api/messages/chat', {
// //           params: {
// //             user1: currentEmail,
// //             user2: selectedUser.email
// //           }
// //         });
// //         setChat(res.data);
// //       } catch (error) {
// //         console.error('🔴 Error fetching chat:', error.message);
// //       }
// //     };

// //     fetchChat();
// //   }, [selectedUser, currentEmail]);

// //   // ✅ Send encrypted message
// //   const handleSend = async () => {
// //     if (!message.trim() || !selectedUser) return;

// //     const encrypted = btoa(message); // base64 encode
// //     setChat(prev => [...prev, { sender: currentEmail, encryptedText: encrypted }]);
// //     setMessage('');

// //     try {
// //       await axios.post('http://localhost:5000/api/messages/send', {
// //         sender: currentEmail,
// //         receiver: selectedUser.email,
// //         encryptedText: encrypted
// //       });
// //     } catch (error) {
// //       console.error('🔴 Error sending message:', error.message);
// //     }
// //   };

// //   return (
// //     <div className="chat-wrapper">
// //       <BackButton />
// //       <div className="chat-container">
// //         <div className="verified-list">
// //           <h3>Verified Users</h3>
// //           {verifiedUsers.map(user => (
// //             <button
// //               key={user.email}
// //               onClick={() => setSelectedUser(user)}
// //               className={selectedUser?.email === user.email ? 'selected' : ''}
// //             >
// //               {user.username}
// //             </button>
// //           ))}
// //         </div>

// //         <div className="chat-box">
// //           <h2>🛡️ Encrypted Chat</h2>
// //           {selectedUser ? (
// //             <>
// //               <h4>Talking to: {selectedUser.username}</h4>
// //               <div className="chat-messages">
// //                 {chat.map((msg, i) => (
// //                   <div
// //                     key={i}
// //                     className={`chat-bubble ${
// //                       msg.sender === currentEmail ? 'sent' : 'received'
// //                     }`}
// //                   >
// //                     <strong>{msg.sender === currentEmail ? 'You' : selectedUser.username}:</strong>{' '}
// //                     {atob(msg.encryptedText)}
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="chat-input">
// //                 <input
// //                   type="text"
// //                   placeholder="Type your message..."
// //                   value={message}
// //                   onChange={e => setMessage(e.target.value)}
// //                 />
// //                 <button onClick={handleSend}>Send</button>
// //               </div>
// //             </>
// //           ) : (
// //             <p>Select a verified user to chat with.</p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // export default ChatPage;
// // import { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import BackButton from '../components/BackButton';
// // import './ChatPage.css';
// // import { generateAESKey, encryptText, decryptText } from '../utils/aesUtils.js';

// // const ChatPage = () => {
// //   const [verifiedUsers, setVerifiedUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [message, setMessage] = useState('');
// //   const [chat, setChat] = useState([]);

// //   const currentUser = localStorage.getItem('username');
// //   const currentEmail = localStorage.getItem('otp_email');

// //   // ✅ Fetch verified users
// //   useEffect(() => {
// //     const fetchVerifiedUsers = async () => {
// //       try {
// //         const res = await axios.get('http://localhost:5000/api/users/verified');
// //         const others = res.data.filter(user => user.email !== currentEmail);
// //         setVerifiedUsers(others);
// //       } catch (error) {
// //         console.error('🔴 Error fetching verified users:', error.message);
// //       }
// //     };

// //     if (currentEmail) {
// //       fetchVerifiedUsers();
// //     }
// //   }, [currentEmail]);

// //   // ✅ Fetch shared AES key from backend or generate+store if not found
// //   const fetchOrCreateAESKey = async (receiverEmail) => {
// //     try {
// //       const res = await axios.get('http://localhost:5000/api/messages/aes-key', {
// //         params: {
// //           user1: currentEmail,
// //           user2: receiverEmail
// //         }
// //       });

// //       if (res.data && res.data.key) {
// //         localStorage.setItem(`aes-key-${receiverEmail}`, res.data.key);
// //         console.log(`🔑 AES key fetched for ${receiverEmail}`);
// //       } else {
// //         const newKey = generateAESKey();
// //         await axios.post('http://localhost:5000/api/messages/aes-key', {
// //           user1: currentEmail,
// //           user2: receiverEmail,
// //           key: newKey
// //         });
// //         localStorage.setItem(`aes-key-${receiverEmail}`, newKey);
// //         console.log(`🆕 AES key generated and stored for ${receiverEmail}`);
// //       }
// //     } catch (error) {
// //       console.error('❌ Error handling AES key:', error.message);
// //     }
// //   };

// //   // ✅ When user is selected, get chat + AES key
// //   useEffect(() => {
// //     const fetchChatAndKey = async () => {
// //       if (!selectedUser || !currentEmail) return;

// //       await fetchOrCreateAESKey(selectedUser.email);

// //       try {
// //         const res = await axios.get('http://localhost:5000/api/messages/chat', {
// //           params: {
// //             user1: currentEmail,
// //             user2: selectedUser.email
// //           }
// //         });
// //         setChat(res.data);
// //       } catch (error) {
// //         console.error('🔴 Error fetching chat:', error.message);
// //       }
// //     };

// //     fetchChatAndKey();
// //   }, [selectedUser, currentEmail]);

// //   // ✅ Send encrypted message using AES
// //   const handleSend = async () => {
// //     if (!message.trim() || !selectedUser) return;

// //     const key = localStorage.getItem(`aes-key-${selectedUser.email}`);
// //     if (!key) {
// //       console.error("No AES key found for this user.");
// //       return;
// //     }

// //     const encrypted = encryptText(message, key);
// //     setChat(prev => [...prev, { sender: currentEmail, encryptedText: encrypted }]);
// //     setMessage('');

// //     try {
// //       await axios.post('http://localhost:5000/api/messages/send', {
// //         sender: currentEmail,
// //         receiver: selectedUser.email,
// //         encryptedText: encrypted
// //       });
// //     } catch (error) {
// //       console.error('🔴 Error sending message:', error.message);
// //     }
// //   };

// //   return (
// //     <div className="chat-wrapper">
// //       <BackButton />
// //       <div className="chat-container">
// //         <div className="verified-list">
// //           <h3>Verified Users</h3>
// //           {verifiedUsers.map(user => (
// //             <button
// //               key={user.email}
// //               onClick={() => setSelectedUser(user)}
// //               className={selectedUser?.email === user.email ? 'selected' : ''}
// //             >
// //               {user.username}
// //             </button>
// //           ))}
// //         </div>

// //         <div className="chat-box">
// //           <h2>🛡️ Encrypted Chat</h2>
// //           {selectedUser ? (
// //             <>
// //               <h4>Talking to: {selectedUser.username}</h4>
// //               <div className="chat-messages">
// //                 {chat.map((msg, i) => {
// //                   const key = localStorage.getItem(`aes-key-${selectedUser.email}`);
// //                   let decrypted = '🔒';

// //                   try {
// //                     decrypted = key ? decryptText(msg.encryptedText, key) : '[No key]';
// //                   } catch (e) {
// //                     console.error('❌ Decryption failed:', e.message);
// //                     decrypted = '❌ Cannot decrypt';
// //                   }

// //                   return (
// //                     <div
// //                       key={i}
// //                       className={`chat-bubble ${msg.sender === currentEmail ? 'sent' : 'received'}`}
// //                     >
// //                       <strong>{msg.sender === currentEmail ? 'You' : selectedUser.username}:</strong>{' '}
// //                       {decrypted}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //               <div className="chat-input">
// //                 <input
// //                   type="text"
// //                   placeholder="Type your message..."
// //                   value={message}
// //                   onChange={e => setMessage(e.target.value)}
// //                 />
// //                 <button onClick={handleSend}>Send</button>
// //               </div>
// //             </>
// //           ) : (
// //             <p>Select a verified user to chat with.</p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatPage;

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import BackButton from '../components/BackButton';
// import './ChatPage.css';

// const socket = io('http://localhost:5000');

// const ChatPage = () => {
//   const [verifiedUsers, setVerifiedUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);

//   const currentUser = localStorage.getItem('username');
//   const currentEmail = localStorage.getItem('otp_email');

//   useEffect(() => {
//     if (currentEmail) {
//       socket.emit('register', currentEmail);
//     }
//   }, [currentEmail]);

//   useEffect(() => {
//     socket.on('receive-message', (msg) => {
//       if (
//         (msg.sender === selectedUser?.email && msg.receiver === currentEmail) ||
//         (msg.sender === currentEmail && msg.receiver === selectedUser?.email)
//       ) {
//         setChat(prev => [...prev, msg]);
//       }
//     });

//     return () => socket.off('receive-message');
//   }, [selectedUser, currentEmail]);

//   useEffect(() => {
//     const fetchVerifiedUsers = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/users/verified');
//         const others = res.data.filter(user => user.email !== currentEmail);
//         setVerifiedUsers(others);
//       } catch (error) {
//         console.error('🔴 Error fetching verified users:', error.message);
//       }
//     };

//     if (currentEmail) {
//       fetchVerifiedUsers();
//     }
//   }, [currentEmail]);

//   useEffect(() => {
//     const fetchChat = async () => {
//       if (!selectedUser || !currentEmail) return;
//       try {
//         const res = await axios.get('http://localhost:5000/api/messages/history', {
//           params: {
//             user1: currentEmail,
//             user2: selectedUser.email
//           }
//         });
//         setChat(res.data);
//       } catch (error) {
//         console.error('🔴 Error fetching chat:', error.message);
//       }
//     };

//     fetchChat();
//   }, [selectedUser, currentEmail]);

//   useEffect(() => {
//     const chatBox = document.querySelector('.chat-messages');
//     if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
//   }, [chat]);

//   const handleSend = async () => {
//     if (!message.trim() || !selectedUser) return;

//     const msgObj = {
//       sender: currentEmail,
//       receiver: selectedUser.email,
//       text: message
//     };

//     setChat(prev => [...prev, { ...msgObj, timestamp: new Date() }]);
//     setMessage('');

//     try {
//       await axios.post('http://localhost:5000/api/messages/send', msgObj);
//     } catch (error) {
//       console.error('🔴 Error saving message:', error.message);
//     }

//     socket.emit('send-message', msgObj);
//   };

//   return (
//     <div className="chat-wrapper">
//       <BackButton />
//       <div className="chat-container">
//         <div className="verified-list">
//           <h3>Verified Users</h3>
//           {verifiedUsers.map(user => (
//             <button
//               key={user.email}
//               onClick={() => setSelectedUser(user)}
//               className={selectedUser?.email === user.email ? 'selected' : ''}
//             >
//               {user.username}
//             </button>
//           ))}
//         </div>

//         <div className="chat-box">
//           <h2>💬 Chat Window</h2>
//           {selectedUser ? (
//             <>
//               <h4>Talking to: {selectedUser.username}</h4>
//               <div className="chat-messages">
//                 {chat.map((msg, i) => (
//                   <div
//                     key={i}
//                     className={`chat-bubble ${msg.sender === currentEmail ? 'sent' : 'received'}`}
//                   >
//                     <strong>{msg.sender === currentEmail ? 'You' : selectedUser.username}:</strong>{' '}
//                     {msg.text}
//                   </div>
//                 ))}
//               </div>
//               <div className="chat-input">
//                 <input
//                   type="text"
//                   placeholder="Type your message..."
//                   value={message}
//                   onChange={e => setMessage(e.target.value)}
//                 />
//                 <button onClick={handleSend}>Send</button>
//               </div>
//             </>
//           ) : (
//             <p>Select a verified user to chat with.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import BackButton from '../components/BackButton';
import './ChatPage.css';

const socket = io('http://localhost:5000');

const ChatPage = () => {
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const currentEmail = localStorage.getItem('otp_email');
  const currentUser = localStorage.getItem('username');

  // ✅ Register socket
  useEffect(() => {
    if (currentEmail) {
      socket.emit('register', currentEmail);
    }
  }, [currentEmail]);

  // ✅ Realtime message receive
  useEffect(() => {
    socket.on('receive-message', (msg) => {
      if (
        (msg.sender === selectedUser?.email && msg.receiver === currentEmail) ||
        (msg.sender === currentEmail && msg.receiver === selectedUser?.email)
      ) {
        setChat(prev => [...prev, msg]);
      }
    });

    return () => socket.off('receive-message');
  }, [selectedUser, currentEmail]);

  // ✅ Fetch verified users (excluding self)
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/verified');
        const others = res.data.filter(user => user.email !== currentEmail);
        setVerifiedUsers(others);
      } catch (err) {
        console.error('❌ Error fetching verified users:', err.message);
      }
    };

    fetchVerifiedUsers();
  }, [currentEmail]);

  // ✅ Fetch message history on user select
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedUser || !currentEmail) return;
      try {
        const res = await axios.get('http://localhost:5000/api/messages/history', {
          params: {
            user1: currentEmail,
            user2: selectedUser.email
          }
        });
        setChat(res.data);
      } catch (err) {
        console.error('❌ Error fetching chat history:', err.message);
      }
    };

    fetchChatHistory();
  }, [selectedUser, currentEmail]);

  // ✅ Auto-scroll chat
  useEffect(() => {
    const chatBox = document.querySelector('.chat-messages');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [chat]);

  // ✅ Send message
  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;

    const msgObj = {
      sender: currentEmail,
      receiver: selectedUser.email,
      text: message
    };

    setChat(prev => [...prev, { ...msgObj, timestamp: new Date() }]);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/messages/send', msgObj);
    } catch (err) {
      console.error('❌ Error sending message:', err.message);
    }

    socket.emit('send-message', msgObj);
  };

  return (
    <div className="chat-wrapper">
      <BackButton />
      <div className="chat-container">
        <div className="verified-list">
          <h3>Verified Users</h3>
          {verifiedUsers.map(user => (
            <button
              key={user.email}
              onClick={() => setSelectedUser(user)}
              className={selectedUser?.email === user.email ? 'selected' : ''}
            >
              {user.username}
            </button>
          ))}
        </div>

        <div className="chat-box">
          <h2>💬 Chat Window</h2>
          {selectedUser ? (
            <>
              <h4>Talking to: {selectedUser.username}</h4>
              <div className="chat-messages">
                {chat.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-bubble ${msg.sender === currentEmail ? 'sent' : 'received'}`}
                  >
                    <strong>{msg.sender === currentEmail ? 'You' : selectedUser.username}:</strong>{' '}
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={message}
                  placeholder="Type your message..."
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSend}>Send</button>
              </div>
            </>
          ) : (
            <p>Select a verified user to chat with.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;








