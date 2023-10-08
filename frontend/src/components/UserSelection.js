import React from 'react';
import { Link } from 'react-router-dom';


const UserSelection = () => {
  return (
    <div className="user-selection-container">
      <h1 className="user-selection-title">Select Your Role</h1>
      <div className="registration-links">
        <Link to="/register/doctor" className="registration-link">
          Register as Doctor
        </Link>
        <Link to="/register/patient" className="registration-link">
          Register as Patient
        </Link>
        <Link to="/createAdmin" className="registration-link">
          Register as Admin
        </Link>
      </div>
    </div>
  );
};
  
  export default UserSelection;