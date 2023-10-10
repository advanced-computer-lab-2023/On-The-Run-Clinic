import React, { useState } from 'react';
import axios from 'axios';

const FilterAppointments = () => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [filterBy, setFilterBy] = useState('status');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilter = async () => {
    try {
      setLoading(true);

      // Send a GET request to your server to filter appointments by date or status
      const response = await axios.get(`http://localhost:4000/filterAppointments?${filterBy}=${filterBy === 'date' ? date : status}`);

      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error filtering appointments:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Filter Appointments</h1>
      <label>
        <input type="radio" value="status" checked={filterBy === 'status'} onChange={() => setFilterBy('status')} />
        Filter by status
      </label>
      <label>
        <input type="radio" value="date" checked={filterBy === 'date'} onChange={() => setFilterBy('date')} />
        Filter by date
      </label>
      {filterBy === 'date' && (
        <label>
          <br />
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      )}
      {filterBy === 'status' && (
        <label>
          <br />
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      )}
      <button onClick={handleFilter}>Filter</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {appointments.length > 0 && (
        <div>
          <h2>Filtered Appointments</h2>
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <p>Date: {appointment.date}</p>
                <p>Status: {appointment.status}</p>
                <p>Doctor: {appointment.doctorId}</p>
                <p>Patient: {appointment.patientId}</p>
                <p>Description: {appointment.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterAppointments;

