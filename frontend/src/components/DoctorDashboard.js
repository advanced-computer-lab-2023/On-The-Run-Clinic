import React from 'react';
import { useParams } from 'react-router-dom';


const DoctorDashboard = () => {
  const { username } = useParams(); 
 
  

  return (
    <div>
      <h1>Doctor's Dashboard</h1>
      
    </div>
  );
};

export default DoctorDashboard;