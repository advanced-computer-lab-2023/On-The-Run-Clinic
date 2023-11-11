import React from 'react';
import { Link,useParams } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling
import { useAuthContext } from '../hooks/useAuthContext'
import {useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useAuthContext()
  
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <ul className="admin-menu">
        <li>
          <a href="/addAdmin" className="menu-link">
            <i className="fas fa-user-plus"></i>
            Add Another Admin
          </a>
        </li>
        <li>
          <a href="/deleteAdmin" className="menu-link">
            <i className="fas fa-users"></i>
            Manage Admins
          </a>
        </li>
        <li>
          <a href="/deleteDoctor" className="menu-link">
            <i className="fas fa-user-md"></i>
            Manage Doctors
          </a>
        </li>
        <li>
          <a href="/deletePatient" className="menu-link">
            <i className="fas fa-clipboard-list"></i>
            Manage Patients
          </a>
        </li>
        <li>
          <a href="/viewRequests" className="menu-link">
            <i className="fas fa-clipboard-list"></i>
            View Requests
          </a>
        </li>
        <li>
          <a href="/healthPackages" className="menu-link">
            <i className="fas fa-clipboard-list"></i>
            Manage Health Packages
          </a>
        </li>
        <li>
          <Link to={`/changeAdminPassword/${username}`} className="menu-link">
            <i className="fas fa-edit"></i>
            change my password
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;