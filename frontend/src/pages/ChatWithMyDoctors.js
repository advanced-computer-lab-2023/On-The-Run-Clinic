// ChatWithMyDoctorse.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate  } from 'react-router-dom';

const ChatWithMyDoctors = () => {
  const { username } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getPatientDoctors/${username}`);
        if (response.status === 200) {
          setDoctors(response.data);
        }
      } catch (error) {
        console.error('Error fetching patient doctors:', error);
      }
    };

    fetchPatientDoctors();
  }, [username]);

  const handleStartChat = () => {
    // Check if a doctor is selected
    if (selectedDoctor && doctors.some(doctor => doctor.username == selectedDoctor )) {
      // Redirect to the chat page with patient and doctor usernames
      navigate(`/chat/${username}/${selectedDoctor}`);
    } else {
      alert('Please enter a doctor to from your list to start chat.');
    }
  };


  return (
    <div>
      <h1>Doctors for {username}</h1>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            <strong>Username:</strong> {doctor.username},<strong>Name:</strong> {doctor.name}, <strong>Specialty:</strong> {doctor.specialty}
          </li>
        ))}
      </ul>

      <div>
        <label>
          Enter Doctor's Username:
          <input
            type="text"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          />
        </label>
        <button onClick={handleStartChat}>Start Chat</button>

        <br/>
        <br/>

        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default ChatWithMyDoctors;
