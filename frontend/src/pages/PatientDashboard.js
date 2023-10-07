import React from 'react';
<<<<<<< HEAD
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
=======
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
>>>>>>> 23d2665d6e57a6c1f6e5bb39c1b258425e4dee85
