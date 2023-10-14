




import React, { useState, useEffect } from 'react';
import axios from 'axios';


import './List.css'; // Import your CSS file for styling

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
 

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getRequests`);

      if (response.status === 200) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  

  return (
    <div className="medicine-list-container">
      <h1>All Requests</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : requests.length > 0 ? (
        <ul className="medicine-list">
          {requests.map((m) => (
            <li key={m._id} className="medicine-item">
              <div className="medicine-details">
                <strong>Name:</strong> {m.name}<br />
                <strong>Username:</strong> {m.username}<br />
                <strong>email:</strong> {m.email}<br />
                <strong>Date Of Birth:</strong> {m.date_of_birth}<br />
                <strong>Hourly Rate:</strong> {m.hourly_rate}<br />
                <strong>speciality:</strong> {m.speciality}<br />
                <strong>Educational Background:</strong> {m.educational_background}<br />
                
                
                
              </div>
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No Requests found.</p>
      )}
    </div>
  );
};

export default ViewRequests;

//  this is a doctor page