import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MyPrescription = () => {
  const { username } = useParams();
  const [p, setP] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchPatients= async () => {
      try {
       
        const response = await axios.get(`http://localhost:4000/getMyPrescriptions?username=${username}`);
        console.log(response.data);

        if (response.status === 200) {
          setP(response.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [username]);
  

  return (
    <div>
      <h1>Prescriptions of {username}</h1>
      

      {loading ? (
        <p>Loading...</p>
      ) : p.length > 0 ? (
        <ul>
          {p.map((familyMember) => (
            <li key={familyMember._id}>
              Medication Name: {familyMember.medicationName}<br />
              dosage: {familyMember.dosage}<br />
              instructions: {familyMember.instructions}<br />
             
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No Patients found.</p>
      )}
    </div>
  );
};

export default MyPrescription;