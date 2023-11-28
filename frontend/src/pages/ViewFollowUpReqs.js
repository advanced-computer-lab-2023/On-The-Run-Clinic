import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

const ViewFollowUpReqs = ({ match }) => {
  const [followUpReqs, setFollowUpReqs] = useState([]);
  const { doctorId } = useParams();

  const fetchFollowUpReqs = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getFollowUpReqs/${doctorId}`);
      setFollowUpReqs(response.data);
    } catch (error) {
      console.error('Error getting follow-up requests:', error);
    }
  };


  useEffect(() => {
    const fetchFollowUpReqs = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getFollowUpReqs/${doctorId}`);
        setFollowUpReqs(response.data);
      } catch (error) {
        console.error('Error getting follow-up requests:', error);
      }
    };

    fetchFollowUpReqs();
  }, [doctorId]);

  const handleAccept = async (id) => {
    try {
      const response = await axios.post(`http://localhost:4000/acceptFollowUpReq/${id}`);
      console.log(`Accepted request ${id}`);
      fetchFollowUpReqs();
      // Update the state or do something with the response if needed
    } catch (error) {
      console.error(`Error accepting request ${id}:`, error);
    }
  };

  const handleReject = async (reqid) => {
    try {
      const response = await axios.post(`http://localhost:4000/rejectFollowUpReq/${reqid}`);
      console.log(`Rejected request ${reqid}`);
      fetchFollowUpReqs();
      // Update the state or do something with the response if needed
    } catch (error) {
      console.error(`Error rejecting request ${reqid}:`, error);
    }
  };
  return (
    <div>
      <h1>Follow-Up Requests</h1>
      {followUpReqs.map((req) => (
        <div key={req._id}>
          <p>Patient: {req.patientId}</p>
          <p>Date: {req.date}</p>
          <p>Status: {req.status}</p>
          <button onClick={() => handleAccept(req._id)}>Accept</button>
          <button onClick={() => handleReject(req._id)}>Reject</button>
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default ViewFollowUpReqs;