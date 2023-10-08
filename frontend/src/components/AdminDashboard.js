import React from 'react';
import { useParams,Link } from 'react-router-dom';


const AdminDashboard = () => {
  const { username } = useParams(); 
 
  

  return (
    <div>
      <h1>Admin's Dashboard</h1>
      <Link to={`/DeleteDoctor/${username}`}>Delete a doctor</Link>
    </div>
  );
};

export default AdminDashboard;