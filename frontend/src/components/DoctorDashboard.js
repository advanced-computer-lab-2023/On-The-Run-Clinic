import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling

const DoctorDashboard = () => {
  const { username } = useParams();

  return (
    <div className="admin-dashboard">
      <h1>Doctor's Dashboard</h1>
      <ul className="admin-menu">
        <li>
          <Link to={`/viewMyPatients/${username}`} className="menu-link">
            <i className="fas fa-users"></i>
            View my patients
          </Link>
        </li>
        <li>
          <Link to={`/searchPatientsByName`} className="menu-link">
            <i className="fas fa-search"></i>
            Search for a patient
          </Link>
        </li>
        <li>
          <Link to={`/updateDoctor/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            Update Info
          </Link>
        </li>
        <li>
          <Link to={`/filterAppointments/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            My appointments
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DoctorDashboard;
