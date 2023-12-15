import React from 'react';
import { Link,useParams } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling
import { useAuthContext } from '../hooks/useAuthContext'
import {useNavigate } from 'react-router-dom';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie,faUserDoctor,faHospitalUser,faFileMedical,faKitMedical } from '@fortawesome/free-solid-svg-icons';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  
  return(
 









<div className="admin-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '90vh' }}>
<div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '275px', height: '400px', margin: '20px' }}>
 
  <Link to={`/deleteAdmin`} >
  <FontAwesomeIcon style={{fontSize:'210px',color:'white',marginTop:'20px',marginBottom:'20px'}} icon={faUserTie} />
    <p style={{ color: 'white', fontSize: '35px', marginBottom: '20px' }}>Manage Admins</p>
  </Link>
</div>
<div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '275px', height: '400px', margin: '20px' }}>
  <Link to={`/deleteDoctor`} >
  <FontAwesomeIcon style={{fontSize:'210px',color:'white',marginTop:'20px',marginBottom:'20px'}} icon={faUserDoctor} />
  <p style={{ color: 'white', fontSize: '35px', marginBottom: '18px' }}>Manage Doctors</p>
  </Link>
</div>
<div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '275px', height: '400px', margin: '20px' }}>
  <Link to={`/deletePatient`} >
  <FontAwesomeIcon style={{fontSize:'210px',color:'white',marginTop:'20px',marginBottom:'20px'}} icon={faHospitalUser} />
    <p style={{ color: 'white', fontSize: '35px', marginBottom: '18px' }}>Manage Patients</p>
  </Link>
</div>
<div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '275px', height: '400px', margin: '20px' }}>
  <Link to={`/viewRequests`} >
  <FontAwesomeIcon style={{fontSize:'210px',color:'white',marginTop:'20px',marginBottom:'20px'}} icon={faFileMedical} />
  <p style={{ color: 'white', fontSize: '35px', marginBottom: '18px' }}>Manage Requests</p>
  </Link>
</div>
<div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '275px', height: '400px', margin: '20px' }}>
  <Link to={`/healthPackages`} >
  <FontAwesomeIcon style={{fontSize:'210px',color:'white',marginTop:'20px',marginBottom:'20px'}} icon={faKitMedical} /><p style={{ color: 'white', fontSize: '35px', marginBottom: '18px' }}>Manage Packages</p>
  </Link>
</div>
</div>



);
};

export default AdminDashboard;