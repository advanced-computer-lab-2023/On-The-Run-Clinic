import React from 'react';
import { useParams,Link } from 'react-router-dom';


const DoctorDashboard = () => {
  const { username } = useParams(); 
 
  

  return (
    <div>
      <h1>Doctor's Dashboard</h1>
      <Link to={`/viewMyPatients/${username}`}>View my patients</Link>
      <Link to={`/searchPatientsByName`}>Search for a patient</Link>
    </div>
  );
};

export default DoctorDashboard;