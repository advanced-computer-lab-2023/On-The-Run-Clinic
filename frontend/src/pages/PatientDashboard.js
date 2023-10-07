import React from 'react';

import { Link,useParams } from 'react-router-dom';


const PatientDashboard = () => {
    const { username } = useParams();
    return (
      <div>
        <h1>Current ID: {username}</h1>
        <Link to={`/viewFamilyMembers/${username}`}>View my family members</Link>
        
        <Link to={`/addFamilyMember/${username}`}>Add family Member</Link>
        <Link to={`/addFamilyMember/${username}`}>Add family Member</Link>
        <Link to={`/filterAppointments/${username}`}>appointments</Link>
      </div>
    );
  };
  

  


export default PatientDashboard;


