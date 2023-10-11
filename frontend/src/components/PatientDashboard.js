import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling


const PatientDashboard = () => {
    const { username } = useParams();
    return (
      <div>
        <h1>Current ID: {username}</h1>
        <Link to={`/viewFamilyMembers/${username}`}>View my family members</Link>
        
        <Link to={`/addFamilyMember/${username}`}>Add family Member</Link>
        <Link to={`/viewMyPrescription/${username}`}>View My Prescriptions</Link>
        <Link to={`/filterAppointmentsPatient/${username}`}>View My Appointments</Link>
        <Link to={`/viewDoctors/`}>View List Of Doctors</Link>

      </div>
    );
  };
  

  


export default PatientDashboard;


