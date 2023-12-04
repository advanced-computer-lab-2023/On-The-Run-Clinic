import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";

const DoctorDashboard = () => {
  const { username } = useParams();
  const [doctor, setDoctor] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:4000/getdoctor/${username}`, { withCredentials: true });
        if (response.status === 200) {
          setDoctor(response.data);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
      setIsLoading(false);
    }
    fetchWallet();
  }, [username]);

  return (
    <div className="admin-dashboard">
      {isLoading ? (
        <div className="spinner-container">
          <BeatLoader color="#14967f" size={15} />
        </div>
      ) : (
        <>
          <strong>Wallet:</strong> {doctor.wallet}
          <h1>Doctor's Dashboard</h1>
          <ul className="admin-menu">
            <li>
              <Link to={`/viewMyPatients/${username}`} className="menu-link">
                <i className="fas fa-users"></i>
                View my patients
              </Link>
            </li>
            <li>
              <Link to={`/filterAppointments/${username}`} className="menu-link">
                <i className="fas fa-edit"></i>
                My appointments
              </Link>
            </li>
            <li>
              <Link to={`/viewFollowup/${doctor._id}`} className="menu-link">
                <i className="fas fa-edit"></i>
                View Follow up requests
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;