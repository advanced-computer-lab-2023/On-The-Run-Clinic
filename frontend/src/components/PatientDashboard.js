import React, { useState, useEffect } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext'
import './Dashboard.css'; // Import your CSS file for styling
import axios from 'axios';
const PatientDashboard = () => {
  const { username } = useParams();
  const [doctor,setDoctor]=useState('')
  const { user } = useAuthContext()
  const navigate = useNavigate();
  const [chatDoctorUsername, setChatDoctorUsername] = useState('');

  const handleChatButtonClick = () => {
    // Redirect to PatientChatPage with the selected doctor's username
    navigate(`/chat/${username}/${chatDoctorUsername}`);
  };
  useEffect(() => {
    // Fetch available health packages from the backend when the component mounts
    
    async function fetchWallet() {
      try {
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`,{
          withCredentials: true
        });
        if (response.status === 200) {
          setDoctor(response.data);
          
        }
      } catch (error) {
        console.error('Error fetching Wallet:', error);
      }
    }
    fetchWallet();
  }, [username]);

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
        <li>
          <Link to={`/subHealthPackages/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            Subscribe to Health Packages
          </Link>
        </li>
        <li>
          <Link to={`/viewHealthPackagesDetails/${username}`} className="menu-link">
            <i className="fas fa-users"></i>
            View my Health Packages
          </Link>
        </li>
        <li>
          <Link to={`/filterAppointmentsPatient/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            view my appointments
          </Link>
        </li>
        <div>
        <label htmlFor="chatDoctorUsername">Chat with Doctor:</label>
        <input
          type="text"
          id="chatDoctorUsername"
          value={chatDoctorUsername}
          onChange={(e) => setChatDoctorUsername(e.target.value)}
          placeholder="Enter Doctor's Username"
        />
        <button onClick={handleChatButtonClick}>Chat</button>
      </div>
      </ul>
    </div>
    
  );
};

export default PatientDashboard;

























