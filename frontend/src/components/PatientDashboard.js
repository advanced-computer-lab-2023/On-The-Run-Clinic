import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling

const PatientDashboard = () => {
  const { username } = useParams();

  return (
    <div className="admin-dashboard">
      <h1>Patient's Dashboard</h1>
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
      </ul>
    </div>
  );
};

export default PatientDashboard;

























