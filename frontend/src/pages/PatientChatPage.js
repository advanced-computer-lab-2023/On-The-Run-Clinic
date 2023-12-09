// PatientChatPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PatientChatPage = () => {
  const {username, doctor } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getChatMessages/${username}/${doctor}`, {
        withCredentials: true,
      });

      if (response.status === 200) {

        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [username, doctor]);
  

  const handleSendMessage = async () => {
    try {

      const response = await axios.post(
        `http://localhost:4000/sendMessageAsPatient`,
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
    <div>
      <h1>Chat with {doctor}</h1>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <strong>{message.patient}</strong> {JSON.stringify(message)}

          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
        <br/>
        <br/>

        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default PatientChatPage;
