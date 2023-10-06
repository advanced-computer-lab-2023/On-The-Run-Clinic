import React from 'react';
import { Link } from 'react-router-dom';
import DoctorRegistrationForm from '../pages/DoctorRegPage';
const UserSelection = () => {
    return (
      <div>
        <h1>Select Your Role</h1>
        <Link to="/register/doctor">Register as Doctor</Link>
        <Link to="/register/patient">Register as Patient</Link>
      </div>
    );
  };
  
  export default UserSelection;