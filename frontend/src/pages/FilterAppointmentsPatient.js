import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';


const PatientAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUpcoming, setSelectedUpcoming] = useState(false);
  const { username } = useParams();
  const [patient, setPatient] = useState(null);
  const [selectedPast, setSelectedPast] = useState(false);

  useEffect(() => {
    const fetchAppointmentsWithDoctors = async () => {
      try {
        const response1 = await axios.get(`http://localhost:4000/search/${username}`,{
          withCredentials: true
        });
        console.log("und"+response1.data._id);
        setPatient(response1.data);

        if (response1.data) {
          const response2 = await axios.get(`http://localhost:4000/getPatientAppointments/${response1.data._id}`,{
            withCredentials: true
          });

          if (response2.status === 200) {
            const patientAppointments = response2.data;
            console.log("dsa" +patientAppointments );

            const appointmentsWithDoctors = [];

            for (const appointment of patientAppointments) {
              try {
                const response = await axios.get(`http://localhost:4000/getDoc/${appointment.doctorId}`,{
                  withCredentials: true
                });

                if (response.status === 200) {
                  const doctorData = response.data;

                  const appointmentWithDoctor = { ...appointment, doctorInfo: doctorData };
                  appointmentsWithDoctors.push(appointmentWithDoctor);
                }
              } catch (error) {
                console.error('Error fetching doctor details:', error);
              }
            }

            setAppointments(appointmentsWithDoctors);
            setFilteredAppointments(appointmentsWithDoctors);
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointmentsWithDoctors();
  }, [username]);

  const handleDateFilterChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    filterAppointments(selectedDate, selectedStatus, selectedUpcoming);
  };

  const handleStatusFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setSelectedStatus(selectedStatus);
    filterAppointments(selectedDate, selectedStatus, selectedUpcoming);
  };

  const handleUpcomingFilterChange = () => {
    const isUpcoming = !selectedUpcoming;
    setSelectedUpcoming(isUpcoming);
    filterAppointments(selectedDate, selectedStatus, isUpcoming);
  };
  const handlePastFilterChange = () => {
    const isPast = !selectedPast;
    setSelectedPast(isPast);
    filterAppointments(selectedDate, selectedStatus, selectedUpcoming, isPast);
  };

  const resetFilters = () => {
    setSelectedDate('');
    setSelectedStatus('');
    setSelectedUpcoming(false);
    setFilteredAppointments(appointments);
    setSelectedPast(false); 
  };

  const filterAppointments = (date, status, upcoming,past) => {
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const currentDate = new Date();

      if (!date && !status && !upcoming&&!past) {
        return true;
      }
      if (date && status && upcoming) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointment.status === status &&
          appointmentDate > currentDate
        );
      }
      if (date && status && past) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointment.status === status &&
          appointmentDate < currentDate
        );
      }
      if (date && status) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointment.status === status
        );
      }
      if (date && upcoming) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointmentDate > currentDate
        );
      }
      if (date && past) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointmentDate < currentDate
        );
      }
      if (status && upcoming) {
        return (
          appointment.status === status &&
          appointmentDate > currentDate
        );
      }
      if (status && past) {
        return (
          appointment.status === status &&
          appointmentDate < currentDate
        );
      }
      if (date) {
        return (
          appointment.date.substring(0, 10) === date
        );
      }
      if (status) {
        return (
          appointment.status === status
        );
      }
      if (upcoming) {
        return (
          appointmentDate > currentDate
        );
      }
      if (past) {
        return (
          appointmentDate < currentDate
        );
      }
      return false;
    });

    setFilteredAppointments(filtered);
  };

  return (
    <div>
      <h1>Patient Appointments</h1>
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
      <div>
        <label>Upcoming Filter:</label>
        <input
          type="checkbox"
          checked={selectedUpcoming}
          onChange={handleUpcomingFilterChange}
        />
      </div>
      <div>
        <label>Past Filter:</label>
        <input
          type="checkbox"
          checked={selectedPast}
          onChange={handlePastFilterChange}
        />
      </div>
      <button onClick={resetFilters}>Reset Filters</button>
      <ul>
        {filteredAppointments.map((appointment) => (
          <li key={appointment._id}>
            Date: {appointment.date}, Status: {appointment.status}, Description: {appointment.description} {appointment.doctorInfo && (
              <span>
                Doctor: <Link to={`/doctor-details/${appointment.doctorInfo.username}`}>{appointment.doctorInfo.name}</Link>
              </span>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default PatientAppointments;
