import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import AdminForm from '../components/AdminForm';

const ManageAdmins = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getAdmins`, {
        withCredentials: true
      });

      if (response.status === 200) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, []);
  const handleDelete = async (adminId) => {
    try {
      // Make a DELETE request to the backend to delete the patient
      await axios.delete(`http://localhost:4000/deleteAdmin/${adminId}`, {
        withCredentials: true
      });

      // After successful deletion, refresh the patient list by re-fetching
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };
  const handleAdminAdded = (admin) => {
    // Add the new admin to the list of admins
    setAdmins(prevAdmins => [...prevAdmins, admin]);
    setIsFormVisible(false);
  };

  return (
    <div className="container">
      <div className="prescriptions-list">
        <h2>
          Admins
          <FontAwesomeIcon
            className="add-icon"
            icon={faPlus}
            onClick={() => setIsFormVisible(true)}
          />
        </h2>
        <ul>
          {admins.map((admin) => (
            <li key={admin._id}>
              <div className="prescription-card">
                <div className="prescription-header">
                  <span><strong>Username: </strong>  {admin.username}</span>
                  <FontAwesomeIcon
                    className="view-icon"
                    icon={faTrash}
                    onClick={() => handleDelete(admin._id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="prescription-form">
        {isFormVisible && <AdminForm onAdminAdded={handleAdminAdded}/>}
      </div>

    </div>

  )
}
export default ManageAdmins
