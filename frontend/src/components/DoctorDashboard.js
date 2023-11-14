
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling
import axios from 'axios';


const DoctorDashboard = () => {
  const { username } = useParams();
  const [doctor,setDoctor]=useState('')
  useEffect(() => {
    // Fetch available health packages from the backend when the component mounts
    async function fetchWallet() {
      try {
        const response = await axios.get(`http://localhost:4000/getdoctor/${username}`, { withCredentials: true });
        if (response.status === 200) {
          setDoctor(response.data);
          
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    }
    fetchWallet();
  }, [username]);

  return (
    <div className="admin-dashboard">
      <strong>Wallet:</strong> {doctor.wallet}
      <h1>Doctor's Dashboard</h1>
      <ul className="admin-menu">
        <li>
          <Link to={`/viewMyPatients/${username}`} className="menu-link">
            <i className="fas fa-users"></i>
            View my patients
          </Link>
        </li>
        
        <li>
          <Link to={`/updateDoctor/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            Update Info
          </Link>
        </li>
        <li>
          <Link to={`/filterAppointments/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            My appointments
          </Link>
        </li>
        <li>
          <Link to={`/changeDoctorPassword/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            Change my password
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default DoctorDashboard;
