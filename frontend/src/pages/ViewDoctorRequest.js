import React, { useState } from 'react';
import axios from 'axios';

const ViewDoctorRequest = () => {
  const [username, setUsername] = useState('');
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const [request, setRequest] = useState(null);
  const handleSearch = async () => {
    try {
      setLoading(true);

      // Send a GET request to your server to search for patients by name
      const response = await axios.get(`http://localhost:4000/getOneRequest?username=${username}`);

      if (response.status === 200) {
        setRequest(response.data[0]);
      }
    } catch (error) {
      console.error('Error searching for Doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Doctor request by Username</h1>
      <input
        type="text"
        placeholder="Enter doctor username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {request && (
        <div>
          <h2>Doctor Request Details</h2>
          <p>Username: {request.username}</p>
          <p>name: {request.name}</p>
          <p>email: {request.email}</p>
          <p>date_of_birth: {request.date_of_birth}</p>
          <p>hourly_rate: {request.hourly_rate}</p>
          <p>speciality: {request.speciality}</p>
          <p>educational_background: {request.educational_background}</p>
        </div>
      )}
      
  
      
    </div>
  );
};

export default ViewDoctorRequest;