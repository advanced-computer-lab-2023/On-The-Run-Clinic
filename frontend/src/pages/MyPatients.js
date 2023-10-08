import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MyPatients = () => {
  const { username } = useParams();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchPatients= async () => {
      try {
       
        const response = await axios.get(`http://localhost:4000/getDocpatients?username=${username}`);
        console.log(response.data);

        if (response.status === 200) {
          setPatients(response.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [username]);
  const handleSearch = () => {
    // Filter patients based on the search name
    const filteredPatients = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setPatients(filteredPatients);
  };
  

  return (
    <div>
      <h1>Patients of {username}</h1>
      <div>
        <input
          type="text"
          placeholder="Enter patient's name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : patients.length > 0 ? (
        <ul>
          {patients.map((familyMember) => (
            <li key={familyMember._id}>
              Name: {familyMember.name}<br />
              National ID: {familyMember.username}<br />
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No Patients found.</p>
      )}
    </div>
  );
};

export default MyPatients;