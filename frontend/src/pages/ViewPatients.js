import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios or your preferred HTTP library
function DoctorPatientsList() {
    const [patients, setPatients] = useState([]); // State to store the list of patients
  
    useEffect(() => {
      // Fetch the list of patients when the component mounts
      const doctorId = '651ea9638df2ecea32185f7e'; // Replace with the actual doctor's ID
      axios.get(`https://localhost:4000/getDocPatients/${doctorId}`
      ) // Replace with your API endpoint
        .then((response) => {
          setPatients(response.data);
        })
        .catch((error) => {
          console.error('Error fetching patients:', error);
        });
    }, []); // Empty dependency array ensures this effect runs once on mount
  
    return (
      <div>
        <h2>List of Patients</h2>
        <ul>
          {patients.map((patient) => (
            <li key={patient._id}>
              {patient.name} - {patient.email}
              {/* Display other patient information as needed */}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default DoctorPatientsList;
  