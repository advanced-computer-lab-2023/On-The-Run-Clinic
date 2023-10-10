import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const { username } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // First, fetch the doctor based on the username
        const response1 = await axios.get(`http://localhost:4000/getDoctor/${username}`);
        console.log(response1);
        setDoctor(response1.data);

        // Then, fetch all appointments based on the doctor's ID
        if (response1.data) {
          console.log(response1.data._id)
          const response2 = await axios.get(`http://localhost:4000/getDoctorAppointments/${response1.data._id}`);
          if (response2.status === 200) {
            console.log(response2.data)
            setAppointments(response2.data);
            setFilteredAppointments(response2.data); // Set filteredAppointments to show all appointments initially
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [username]);

  const handleDateFilterChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    filterAppointments(selectedDate, selectedStatus);
  };

  const handleStatusFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setSelectedStatus(selectedStatus);
    filterAppointments(selectedDate, selectedStatus);
  };

  const resetFilters = () => {
    setSelectedDate('');
    setSelectedStatus('');
    setFilteredAppointments(appointments); // Reset filters to show all appointments
  };

  const filterAppointments = (date, status) => {
    const filtered = appointments.filter((appointment) => {
      if (!date && !status) {
        return true; // No filters applied, return all appointments
      }
      if (date && status) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointment.status === status
        );
      }
      if (date) {
        return appointment.date.substring(0, 10) === date;
      }
      if (status) {
        return appointment.status === status;
      }
      return false;
    });

    setFilteredAppointments(filtered);
  };

  return (
    <div>
      <h1>Doctor Appointments</h1>
      <div>
        <label>Date Filter:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateFilterChange}
        />
      </div>
      <div>
        <label>Status Filter:</label>
        <select
          value={selectedStatus}
          onChange={handleStatusFilterChange}
        >
          <option value="">All</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button onClick={resetFilters}>Reset Filters</button>
      <ul>
        {filteredAppointments.map((appointment) => (
          <li key={appointment._id}>
            Date: {appointment.date}, Status: {appointment.status}, Description: {appointment.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
