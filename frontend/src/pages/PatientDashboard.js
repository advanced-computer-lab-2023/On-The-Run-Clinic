import React from 'react';
import { useParams } from 'react-router-dom';


const PatientDashboard = () => {
  const { username } = useParams(); 
 
  

  return (
    <div>
      <h1>Patient's Dashboard</h1>
    
      <h1>Add Family Member</h1>
      <Link to="/add/familymember"></Link>

    </div>
  );
};

export default PatientDashboard;