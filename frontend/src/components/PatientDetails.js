import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PatientDetails = () => {
  const { username } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Make an API request to get all patient information
        const response = await axios.get('http://localhost:4000/getPatients');

        if (response.status === 200) {
          const allPatients = response.data;

          // Find the patient with the matching username
          const matchingPatient = allPatients.find((pat) => pat.username === username);
          if (matchingPatient) {
            setPatient(matchingPatient);
          } else {
            // Handle the case where no patient with the username is found
            console.error('Patient not found:', username);
          }
        }
      } catch (error) {
        // Handle API request errors more gracefully
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false); // Mark loading as complete, whether successful or not
      }
    };

    // Call the fetchPatientData function when the component mounts
    fetchPatientData();
  }, [username]);

  // Use another useEffect for fetching prescriptions, but make sure it depends only on username
  useEffect(() => {
    if (username) {
      const fetchPrescriptions = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/getMyPrescriptions/${username}`);
          if (response.status === 200) {
            setPrescriptions(response.data);
          }
        } catch (error) {
          console.error('Error fetching prescriptions:', error);
        }
      };

      // Call the fetchPrescriptions function when the username changes
      fetchPrescriptions();
    }
  }, [username]);

  useEffect(() => {
    // ...

    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getFamilyMem/${username}`);
        if (response.status === 200) {
          setFamilyMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    // Call the fetchFamilyMembers function when the patient ID changes
      fetchFamilyMembers();
  }, [patient]);


     /* const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getFamilyMem/${patient._id}`);
        if (response.status === 200) {
          setFamilyMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };*/


  if (loading) {
    return <div>Loading patient details...</div>;
  }

  if (!patient) {
    return <div>Patient Not Found</div>;
  }

  return (
    <div>
      <h2>Patient Details</h2>
      <p>Name: {patient.name}</p>
      <p>Username: {patient.username}</p>
      <p>Email: {patient.email}</p>
      <p>Date of Birth: {patient.date_of_birth}</p>
      <p>Gender: {patient.gender}</p>
      <p>Mobile Number: {patient.mobileNumber}</p>
      <p>Emergency Contact Name: {patient.emergencyContact.fullname}</p>
      <p>Emergency Contact Mobile Number: {patient.emergencyContact.mobileNumber}</p>

      <h3>Family Members</h3>
      <ul>
        {familyMembers.map((familyMember) => (
          <li key={familyMember._id}>
            Name: {familyMember.name}<br />
            National ID: {familyMember.national_id}<br />
            Age: {familyMember.age}<br />
            Gender: {familyMember.gender}<br />
            Relation: {familyMember.relation}<br />
          </li>
        ))}
      </ul>

      <h3>Prescriptions</h3>
      <ul>
        {prescriptions.map((prescription) => (
          <li key={prescription._id}>
            Medication Name: {prescription.medicationName}<br />
            Dosage: {prescription.dosage}<br />
            Instructions: {prescription.instructions}<br />
            Date: {new Date(prescription.date).toLocaleDateString()}<br />
            Filled: {prescription.filled ? 'Yes' : 'No'}<br />
          </li>
        ))}
      </ul>

      {/* Display additional patient information and health records here */}
    </div>
  );
};

export default PatientDetails;
