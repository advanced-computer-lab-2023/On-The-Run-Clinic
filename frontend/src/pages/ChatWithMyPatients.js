// ChatWithMyPatients.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ChatWithMyPatients = () => {
  const { username } = useParams();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDocPatients/${username}`);
        if (response.status === 200) {
          setPatients(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctor patients:', error);
      }
    };

    fetchDoctorPatients();
  }, [username]);

  const handleStartChat = () => {
    // Check if a patient is selected
    if (selectedPatient && patients.some(patient => patient.username === selectedPatient)) {
      // Redirect to the chat page with doctor and patient usernames
      navigate(`/chat/${username}/${selectedPatient}`);
    } else {
      alert('Please enter a patient from your list to start chat.');
    }
  };


  return (
    <div>
      <h1>Patients for {username}</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient._id}>
            <strong>Username:</strong> {patient.username}, <strong>Name:</strong> {patient.name}
          </li>
        ))}
      </ul>

      <div>
        <label>
          Enter Patient's Username:
          <input
            type="text"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          />
        </label>
        <button onClick={handleStartChat}>Start Chat</button>

        <br />
        <br />

        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default ChatWithMyPatients;
