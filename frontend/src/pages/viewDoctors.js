import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './MedicineList.css'; // Import your CSS file for styling
import DoctorDetails from './doctorDetails';
import { Link } from 'react-router-dom';


const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [SpecialtyFilter, setSpecialtyFilter] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterHour, setFilterHour] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getDoctors`);

      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getAllAppointments`);

      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  const fetchPatient = async (patientId) => { // Add this function
    try {
      const response = await axios.get(`http://localhost:4000/getPatient/${patientId}`);

      if (response.status === 200) {
        setPatient(response.data);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchPatient(patient); // Replace 'patient_id_here' with the actual patient ID
  }, []);
  const doctorIsAvailable = (doctorId, filterDate, filterHour) => {
    // Convert filterHour to a number
    const filterHourNumber = parseInt(filterHour);
    const filterDateObj = new Date(filterDate);
  
    // Check if there are appointments for the specified doctor, date, and hour
    return !appointments.some((appointment) => {
      return (
        appointment.doctorId === doctorId &&
        appointment.date === filterDateObj &&
        appointment.hour === filterHourNumber
      );
    });
  };

  const handleSearch = () => {
    if (searchName === '' && SpecialtyFilter === ''&& filterDate === '' && filterHour === '') {
      fetchDoctors();
      return;
    }

    const filtered = doctors.filter((doctor) => {
      const nameMatch = searchName
        ? doctor.name && doctor.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const medicalUseMatch = SpecialtyFilter
        ? doctor.speciality && doctor.speciality.toLowerCase().includes(SpecialtyFilter.toLowerCase())
        : true;
      const isDoctorAvailable = doctorIsAvailable(doctor._id, filterDate, filterHour);
      return nameMatch && medicalUseMatch && isDoctorAvailable;
    });

    setDoctors(filtered);
    console.log(filtered);
  };
  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    handleSearch();
  };

  const handleMedicalUseFilterChange = (e) => {
    setSpecialtyFilter(e.target.value);
    handleSearch();
  };
  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
    handleSearch();
  };

  const handleFilterHourChange = (e) => {
    setFilterHour(e.target.value);
    handleSearch();
  };

  const resetFilters = () => {
    setSearchName('');
    setSpecialtyFilter('');
    setFilterDate('');
    setFilterHour('');
    fetchDoctors();
  };

  return (
    <div className="medicine-list-container">
      <h1>All Doctors</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Enter doctor's name"
          value={searchName}
          onChange={handleSearchNameChange}
        />
        <input
          type="text"
          placeholder="Filter by Specialty"
          value={SpecialtyFilter}
          onChange={handleMedicalUseFilterChange}
        />
         <input
          type="date"
          placeholder="Select Date of Appointment"
          value={filterDate}
          onChange={handleFilterDateChange}
        />
        <input
          type="number"
          placeholder="Enter Hour of Appointment"
          value={filterHour}
          onChange={handleFilterHourChange}
        />
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : doctors.length > 0 ? (
        <ul className="medicine-list">
         
          {doctors.map((m) => (
            
            <li
              key={m._id}
              className="medicine-item"
              onClick={() => handleDoctorClick(m)} // Add this click handler
            >
              <div className="medicine-details">
                <strong>Name:</strong> <Link to={`/doctor-details/${m.username}`}> {m.name} </Link><br />
                <strong>Speciality:</strong> {m.speciality}<br />
                <strong>Username:</strong> {m.username}<br />
                <strong>Session Price:</strong>{m.hourlyRate * (1-patient?.healthPackage?.discount)}<br />
              </div>
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No Doctors found.</p>
      )}
      {selectedDoctor && (
        <DoctorDetails doctor={selectedDoctor} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default DoctorListPage;


/*this is a doctor page*/