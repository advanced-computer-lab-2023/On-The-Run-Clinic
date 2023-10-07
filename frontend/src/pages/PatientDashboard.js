import React from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
    return (
      <div>
        <h1>PatientDashboard</h1>
        <Link to="/getFamilyMembers">View my family members</Link>
        
      </div>
    );
  };
  
  export default PatientDashboard;