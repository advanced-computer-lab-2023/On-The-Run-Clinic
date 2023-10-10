import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PatientDetails from '../components/PatientDetails'; // Adjust the path as needed

const MyPatients = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [originalPatients, setOriginalPatients] = useState([]); // Store original patient data
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDocpatients/${username}`);
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

    fetchPatients();
  }, [username]);

  const handleSearchByName = () => {
    const filteredPatientsByName = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchName.toLowerCase())
    );
    return filteredPatientsByName;
  };

  const handleSearchNameButton = () => {
    const filteredPatients = searchName ? handleSearchByName() : originalPatients; // Use original patients for filtering
    setPatients(filteredPatients);
  };

  const handleResetFilterButton = () => {
    setSearchName('');
    setPatients(originalPatients); // Reset patients to original data
  };

  return (
    <div>
      <h1>Patients of {username}</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearchNameButton}>Search by Name</button>
        <button onClick={handleResetFilterButton}>Reset Filter</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {patients.length > 0 ? (
            <ul>
              {patients.map((patient) => {
                return (
                  <li
                    key={patient._id} // Make sure patient._id is unique
                    //onClick={() => handlePatientSelect(patient)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Link to={`/patient-details/${patient.username}`}>
                      Name: {patient.name}
                      <br />
                      Username: {patient.username}
                      <br />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No Patients found.</p>
          )}
        </div>
      )}
      {selectedPatient && <PatientDetails patient={selectedPatient} />}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default MyPatients;
