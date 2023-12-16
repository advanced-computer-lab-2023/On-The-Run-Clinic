import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BeatLoader from "react-spinners/BeatLoader";
import {faEye, faVideo, faComments } from '@fortawesome/free-solid-svg-icons';

const MyPatients = () => {
  const { username } = useParams();
  const [patients, setPatients] = useState([]);
  const [originalPatients, setOriginalPatients] = useState([]); // Store original patient data
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
 
  const [doctor1, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDoctorByUsername/${username}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setDoctor(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } // replace 'username' with the actual username

    };
    const fetchPatients = async () => {
      try { 
        const response = await axios.get(`http://localhost:4000/getDocpatients/${username}`, {
          withCredentials: true
        });
        console.log(response.data);

        if (response.status === 200) {
          setPatients(response.data);
          setOriginalPatients(response.data); // Store original patient data
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
    fetchPatients();
  }, [username]);

  const handleSearchByName = (searchValue) => {
    const filteredPatientsByName = originalPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setPatients(filteredPatientsByName);
  };

  const handleInputChange = (e) => {
    setSearchName(e.target.value);
    handleSearchByName(e.target.value);
  };




  return (
    <div className="container">
      <div className="patients-list">
        <h2>My Patients</h2>
        <div className="search-bar">
          <input
            type="text"
            value={searchName}
            onChange={handleInputChange}
            placeholder="Search by name"
          />
        </div>
        {loading ? (
          <div className="spinner-container">
            <BeatLoader color="#14967f" size={15} />
          </div>
        ) : patients.length === 0 ? (
          <p>No patients found</p>
        ) : (
          <ul className="patients-list">
            {patients.map((p) => (
              <li key={p._id}>
                <div className="patients-header">
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Name: </strong>{p.name}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>ID: </strong>{p._id}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' ,marginRight:'10px'}}>
                    <Link to={`/patient-details/${p.username}/${username}`}>
                    <FontAwesomeIcon icon={faEye} color="#14967f" />
                    </Link>
                    <Link to={`/chat/${username}/${p.username}`}>
                    <button style={{ background: 'transparent', border: 'none' }}>
                      <FontAwesomeIcon icon={faComments} color="#14967f" style={{ marginLeft: '10px' }} />
                      </button>
                  </Link>
                    <button style={{ background: 'transparent', border: 'none' }}  onClick={(e) => { e.stopPropagation(); window.open('https://meet.google.com/', '_blank') }}>
                      <FontAwesomeIcon icon={faVideo} color="#14967f" style={{ marginLeft: '10px' }} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyPatients;
