import React from 'react';

import { Link,useParams } from 'react-router-dom';


const PatientDashboard = () => {
    const { username } = useParams();
    return (
      <div>
        <h1>Current ID: {username}</h1>
        <Link to={`/getFamilyMembers/${username}`}>View my family members</Link>
        
      </div>
    );
  };
  
  export default PatientDashboard;