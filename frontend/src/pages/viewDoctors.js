import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VDoctors = () => {
  const { username } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorUsername, setDoctorUsername] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchSpec, setSearchSpec] = useState('');

  useEffect(() => {
    const fetchDoctorss = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDoctors`);
        const response2 = await axios.get(`http://localhost:4000/getAllAppointments`);

        if (response.status === 200) {
          let filteredDoctors = response.data;
          let filteredAppointments =response2.data;

          // Apply filters to the doctors
          if (speciality) {
            filteredDoctors = filteredDoctors.filter(
              (doctor) => doctor.speciality === speciality
            );
          }

          if(selectedDoctor._id === appointments.doctorId){
            filteredAppointments = filteredAppointments.filter(
              (appointment) => appointment.doctorId === selectedDoctor._id
            );
          }

          if (filterDate) {
            filteredAppointments = filteredAppointments.filter(
              (appointment) => appointment.date === filterDate
            );
          }

          if (filterStatus) {
            filteredAppointments = filteredAppointments.filter(
              (appointment) => appointment.status === filterStatus
            );
          }

          setDoctors(filteredDoctors);
          setAppointments(filteredAppointments);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [username, speciality, filterDate, filterStatus]);
  const handleViewDoctor = (doctor) => {
    // Set the selected doctor to display its details in a modal or side panel
    setSelectedDoctor(doctor);
  };

  const handleCloseModal = () => {
    // Clear the selected doctor to close the modal or side panel
    setSelectedDoctor(null);
  };
  const handleSearch = () => {
    // Filter docotrs based on the search name
    const filteredDoctors = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchName.toLowerCase()) &&
      doctor.speciality.toLowerCase().includes(searchSpec.toLowerCase())
    );
    setDoctors(filteredDoctors);
  };

  return (
    <div>
      <h1>Doctors</h1>

      {/* Filter form */}
      <form>
        <div>
          <label>
            Doctor Name:
            <input
              type="text"
              value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </label>
          <label>
            Doctor speciality:
            <input
              type="text"
              value={searchSpec}
            onChange={(e2) => setSearchSpec(e2.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </label>
        </div>
        <div>
          <label>
            Filter by Date:
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Filter by Status:
            <input
              type="text"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </label>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : doctors.length > 0 ? (
        <ul>
          {doctors.map((doctor) => (
             <li key={doctor._id}>
             Doctor Name: {doctor.name}<br />
             Speciality: {doctor.speciality}<br />
            Session price: {doctor.hourly_raterate * 1.1 - doctor.hourly_rate/ 100}
             <button onClick={() => handleViewDoctor(doctor)}>View Doctor</button>
           </li>
          ))}
        </ul>
      ) : (
        <p>No Doctors found.</p>
      )}
      {selectedDoctor && (
        <div>
          {/* Display doctor details here */}
          <h2>Doctor Details</h2>
          <p>Doctor Name: {selectedDoctor.name}</p>
          <p>Email: {selectedDoctor.email}</p>
          <p>Speciality: {selectedDoctor.speciality}</p>
          <p>Affiliation: {selectedDoctor.Affiliation}</p>
          <p>Educational Background: {selectedDoctor.educational_background}</p>
          <p>Hourly Rate: {selectedDoctor.hourly_rate}</p>
          {/* Add close button or functionality to close the modal */}
          <button onClick={handleCloseModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default VDoctors;