// PatientChatPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PatientChatPage = () => {
  const { username, doctor } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getChatMessages/${username}/${doctor}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const fetchedMessages = response.data;
        setMessages(fetchedMessages || []);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents a newline character from being added
      handleSendMessage();
    }
  };
  useEffect(() => {
    fetchMessages(); // Fetch messages when the component mounts

    // Set up polling to fetch messages every 5 seconds (adjust as needed)
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 500);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [username, doctor]);
  useEffect(() => {
    // Scroll to the bottom of the chat container after messages are loaded or new message is sent
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/sendMessageAsPatient',
        {
          sender: username,
          receiver: doctor,
          message: newMessage,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={chatContainerStyle}>
      <div style={chatHeaderStyle}>
        <h1>Chat with {doctor}</h1>
      </div>
      <div id="messageContainer" style={messageContainerStyle}>
        {messages[0] && messages[0].messages && messages[0].messages.map((message, index) => (
          <div key={`message-${index}`} style={messageStyle(message.sender === 'patient')}>
            <span style={messageSenderStyle}>
              {message.sender === 'patient' ? 'You' : doctor}
            </span>
            <span style={messageContentStyle}>{message.content}</span>
            <span style={timestampStyle}>{formatTimestamp(message.timestamp)}</span>
          </div>
        ))}
      </div>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} style={buttonStyle}>
          Send
        </button>
      </div>
    </div>
  );
};

// Styles (keep the styles consistent with PharmacistChatPage)
const chatContainerStyle = {
  maxWidth: '800px',
  margin: 'auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const chatHeaderStyle = {
  marginBottom: '20px',
};

const messageContainerStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  marginBottom: '20px',
};

const messageStyle = (isSentByUser) => ({
  textAlign: isSentByUser ? 'right' : 'left',
  margin: '10px 0',
  padding: '10px',
  borderRadius: '8px',
  background: isSentByUser ? '#e0f7fa' : '#fff',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
});

const messageSenderStyle = {
  fontWeight: 'bold',
};

const inputContainerStyle = {
  display: 'flex',
};

const inputStyle = {
  flex: '1',
  marginRight: '10px',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '4px',
  background: '#4caf50',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const timestampStyle = {
  marginLeft: '10px',
  fontSize: '0.8rem',
  color: '#888',
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const messageContentStyle = {
  marginLeft: '5px',
  wordBreak: 'break-word', // Ensure long words break onto the next line
  maxWidth: '400px', // Adjust the maximum width as needed
};

export default PatientChatPage;
