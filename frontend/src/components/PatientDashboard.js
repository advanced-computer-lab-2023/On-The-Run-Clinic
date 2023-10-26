import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling
import axios from 'axios';
const PatientDashboard = () => {
  const { username } = useParams();
  const [doctor,setDoctor]=useState('')
  useEffect(() => {
    // Fetch available health packages from the backend when the component mounts
    async function fetchWallet() {
      try {
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`);
        if (response.status === 200) {
          setDoctor(response.data);
          
        }
      } catch (error) {
        console.error('Error fetching health packages:', error);
      }
    }
    fetchWallet();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Patient's Dashboard</h1>
      <strong>Wallet:</strong> {doctor.wallet}
      <ul className="admin-menu">
        <li>
          <Link to={`/viewFamilyMembers/${username}`} className="menu-link">
            <i className="fas fa-users"></i>
            View my family Members
          </Link>
        </li>
        
        <li>
          <Link to={`/viewMyPrescription/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            view My prescriptions
          </Link>
        </li>
        <li>
          <Link to={`/viewDoctors/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
           view Doctors
          </Link>
        </li>
        <li>
          <Link to={`/addFamilyMember/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            add family member
          </Link>
        </li>
        <li>
          <Link to={`/linkFamilyMember/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            Link family member
          </Link>
        </li>
        <li>
          <Link to={`/deleteMedicalHistory/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            Manage Medical History
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PatientDashboard;

























