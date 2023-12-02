



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './List.css'; // Import your CSS file for styling

const DeleteDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
 

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getDoctors`,{
        withCredentials: true
      });

      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  const handleDelete = async (doctorId) => {
    try {
      // Make a DELETE request to the backend to delete the patient
      await axios.delete(`http://localhost:4000/deleteDoctor/${doctorId}`,{
        withCredentials: true
      });

      // After successful deletion, refresh the patient list by re-fetching
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <div className="medicine-list-container">
      <h1>All Doctors</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : doctors.length > 0 ? (
        <ul className="medicine-list">
          {doctors.map((m) => (
            <li key={m._id} className="medicine-item">
              <div className="medicine-details">
                <strong>Name:</strong> {m.name}<br />
                <strong>Username:</strong> {m.username}<br />
                <strong>email:</strong> {m.email}<br />
               
                <Link to="#" onClick={() => handleDelete(m._id)}>Delete</Link>
                
                
              </div>
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No Doctors found.</p>
      )}
    </div>
  );
};

export default DeleteDoctor;

//   this is a doctor page