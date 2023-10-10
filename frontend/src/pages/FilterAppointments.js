import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './MedicineList.css';

const FilterAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchStatus, setStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getAllAppointments`);

      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = () => {
    if (searchStatus === '' && !selectedDate) {
      fetchAppointments();
      return;
    }

    const filtered = appointments.filter((appointment) => {
      const nameMatch = searchStatus
        ? appointment.status && appointment.status.toLowerCase().includes(searchStatus.toLowerCase())
        : true;

      const dateMatch = selectedDate
        ? formatDate(new Date(appointment.date)) === formatDate(new Date(selectedDate))
        : true;

      return nameMatch && dateMatch;
    });

    setAppointments(filtered);
  };

  const handleSearchNameChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const resetFilters = () => {
    setStatus('');
    setSelectedDate(null);
    fetchAppointments();
  };

  return (
    <div className="medicine-list-container">
      <h1>All Appointments</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Enter status"
          value={searchStatus}
          onChange={handleSearchNameChange}
        />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select a date"
        />
        <button onClick={handleSearch}>Apply Filters</button>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length > 0 ? (
        <ul className="medicine-list">
          {appointments.map((m) => (
            <li key={m._id} className="medicine-item">
              <div className="medicine-details">
                <strong>Status:</strong> {m.status}<br />
                <strong>Date:</strong> {m.date}<br />
                <strong>Description:</strong> {m._id}<br />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Appointments found.</p>
      )}
    </div>
  );
};

export default FilterAppointments;
