import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';

import './patientDetails.css';

const PatientDetails = () => {
  const { username,usernameDoctor } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    
    const fetchPatientData = async () => {
      try {
        // Make an API request to get all patient information
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`,{
          withCredentials: true
        });

        if (response.status === 200) {
          setPatient(response.data);
        }
      } catch (error) {
        // Handle API request errors more gracefully
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false); // Mark loading as complete, whether successful or not
      }
    };

    // Call the fetchPatientData function when the component mounts
    fetchPatientData();
    
  }, [username]);
  

  if (loading) {
    return <div>Loading patient details...</div>;
  }

  if (!patient) {
    return <div>Patient Not Found</div>;
  }

  return (
    <div className="container">
    <div className="details-container">
    <h2 className="title">Patient Details</h2>
  <table style={{ fontSize: '1.5em', padding: '10px' }}>
    <tbody>
      <tr>
        <th>Name:</th>
        <td>{patient.name}</td>
      </tr>
      <tr>
        <th>Username:</th>
        <td>{patient.username}</td>
      </tr>
      <tr>
        <th>Email:</th>
        <td>{patient.email}</td>
      </tr>
      <tr>
        <th>Date of Birth:</th>
        <td>{new Date(patient.date_of_birth).toLocaleDateString()}</td>
      </tr>
      <tr>
        <th>Gender:</th>
        <td>{patient.gender}</td>
      </tr>
      <tr>
        <th>Mobile Number:</th>
        <td>{patient.mobileNumber}</td>
      </tr>
      <tr>
        <th>Emergency Contact Name:</th>
        <td>{patient.emergencyContact.fullName}</td>
      </tr>
      <tr>
        <th>Emergency Contact Mobile Number:</th>
        <td>{patient.emergencyContact.mobileNumber}</td>
      </tr>
    </tbody>
  </table>
  </div>
  <div className="button-container">
      <Link to={`/managePrescriptions/${username}/${usernameDoctor}`}>
       <button className="button">Manage Prescriptions</button>
      </Link>
      <button className="button" onClick={() => navigate(-1)}>Back</button>
    </div>
  </div>


    
  );
};

export default PatientDetails;
