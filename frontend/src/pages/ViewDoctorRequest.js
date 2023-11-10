




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
  const handleAccept = async (reqid,name,username,password,email,date_of_birth,hourly_rate,speciality,educational_background) => {
    try {
      const response = await axios.post(`http://localhost:4000/acceptRequest/${username}/${name}/${email}/${password}/${date_of_birth}/${hourly_rate}/${speciality}/${speciality}/${educational_background}`);
     
      if (response.status === 200) {
        setRequests(requests.filter((r) => r._id !== reqid));
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };
  
  const handleReject = async (reqid) => {
    try {
      // Make a DELETE request to the backend to delete the patient
      await axios.put(`http://localhost:4000/rejectRequest/${reqid}`);

      // After successful deletion, refresh the patient list by re-fetching
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting doctor request:', error);
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
            {(m.status1 !== 'rejected' && m.status1 !== 'accepted') && (
              <>
                <button onClick={() => handleAccept(m._id,m.name,m.username,m.password,m.email,m.date_of_birth,m.hourly_rate,m.speciality,m.educational_background)}>Accept</button>
                <button onClick={() => handleReject(m._id)}>Reject</button>
              </>
            )}
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