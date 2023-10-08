import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MyPatients = () => {
  const { username } = useParams();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchByAppointment, setSearchByAppointment] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDocpatients/${username}`);
        console.log(response.data);

        if (response.status === 200) {
          setPatients(response.data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [username]);

  // Function to check if a patient belongs to a specific doctor
  


  const handleSearchByName = () => {
    const filteredPatientsByName = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchName.toLowerCase()) 
    );
    return filteredPatientsByName;
  };

  const handleSearchByAppointment = () => {
    const filteredPatientsByAppointment = patients.filter((patient) =>
      patient.appointments.some((appointment) =>
        new Date(appointment.date).toDateString().includes(searchByAppointment)
      )
    );
    return filteredPatientsByAppointment;
  };

  const handleSearchNameButton = () => {
    const filteredPatients = searchName ? handleSearchByName() : patients;
    setPatients(filteredPatients);
  };

  const handleSearchAppointmentButton = () => {
    const filteredPatients = searchByAppointment ? handleSearchByAppointment() : patients;
    setPatients(filteredPatients);
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
      </div>
      <div>
        <input
          type="text"
          placeholder="Search by appointment (e.g., 'YYYY-MM-DD')"
          value={searchByAppointment}
          onChange={(e) => setSearchByAppointment(e.target.value)}
        />
        <button onClick={handleSearchAppointmentButton}>Search by Appointment</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {patients.length > 0 ? (
            <ul>
              {patients.map((patient) => (
                <li key={patient._id}>
                  Name: {patient.name}<br />
                  Username: {patient.username}<br />
                  {/* Add more patient details as needed */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No Patients found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPatients;
