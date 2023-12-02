import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorDetails = () => {
  const { doctorUsername , patientUsername } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Make an API request to get all doctor information
        const response = await axios.get('http://localhost:4000/getDoctors',{
          withCredentials: true
        });

        if (response.status === 200) {
          const allDoctors = response.data;

          // Find the doctor with the matching username
          const matchingDoctor = allDoctors.find((doc) => doc.username === doctorUsername);
          if (matchingDoctor) {
            setDoctor(matchingDoctor);
          } else {
            // Handle the case where no doctor with the username is found
            console.error('Doctor not found:', doctorUsername);
          }
        }
      } catch (error) {
        // Handle API request errors more gracefully
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false); // Mark loading as complete, whether successful or not
      }
    };

    // Call the fetchDoctorData function when the component mounts
    fetchDoctorData();
  }, [doctorUsername]);

  if (loading) {
    return <div>Loading doctor details...</div>;
  }

  if (!doctor) {
    return <div>Doctor Not Found</div>;
  }

  return (
    <div>
      <h2>Doctor Details</h2>
      <p>Name: {doctor.name}</p>
      <p>Username: {doctor.username}</p>
      <p>Email: {doctor.email}</p>
      <p>Date of Birth: {doctor.date_of_birth}</p>
      <p>Hourly Rate: {doctor.hourly_rate}</p>
      <p>Affiliation: {doctor.Affiliation}</p>
      <p>Speciality: {doctor.speciality}</p>
      <p>Educational Background: {doctor.educational_background}</p>

      {/* Display additional doctor information and appointments here */}
      <button onClick={() => navigate(-1)}>Back</button>
      <Link to={`/viewAppointments/${doctorUsername}/${patientUsername}`}>
        <button>View Appointments</button>
      </Link>
    </div>
  );
};

export default DoctorDetails;