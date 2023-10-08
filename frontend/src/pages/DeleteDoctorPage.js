import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteDoctor = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete('http://localhost:4000/deleteDoctor', {
        data: { username: username },
      });

      if (response.status === 201) {
        console.log('successful Deletion:', response.data);
        setUsername('');
        setError(null);
        // You can handle redirection or other actions here
        //navigate(`/dashboard/admin/${username}`);
      } else {
        console.error('Deletion failed:', response.data);
        // Handle and display errors to the user
      }
    } catch (error) {
      console.error('Deletion failed:', error);
      // Handle and display errors to the user
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>

        <button type="submit">delete DR</button>
      </form>
    </div>
  );
};

export default DeleteDoctor;