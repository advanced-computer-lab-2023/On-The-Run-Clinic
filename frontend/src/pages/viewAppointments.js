import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , useNavigate} from 'react-router-dom';

const ViewAppointments = () => {
  const { doctorUsername, patientUsername } = useParams();
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId , setPatientId] = useState(null);

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getDoctors');
        if (response.status === 200) {
          const doctor = response.data.find((doc) => doc.username === doctorUsername);
          if (doctor) {
            setDoctorId(doctor._id);
          } else {
            console.error('Doctor not found:', doctorUsername);
          }
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    const fetchPatientId = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/getPatientByUsername/${patientUsername}`);
            if (response.status === 200) {
                setPatientId(response.data._id);
                console.log(patientId);
            }
        }
        catch(error) {
            console.error('Error fetching Patient',error);
        }
        }

    const fetchAppointments = async () => {
      try {
        if (doctorId) {
          const response = await axios.get(`http://localhost:4000/getAvailableDoctorAppointments/${doctorId}`);
          if (response.status === 200) {
            setAppointments(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorId();
    fetchPatientId();
    fetchAppointments();
  }, [doctorUsername, doctorId]);

  const reserveAppointment = async (appointmentId) => {
    try {
        console.log("APP ID " + appointmentId);
      const response = await axios.post(`http://localhost:4000/reserveAppointment/${appointmentId}`, {
        patientId,
        status: 'Scheduled',
        description: 'Checkup',
      });
      if (response.status === 200) {
        // Handle success, maybe show a success message or update the UI
        alert('Appointment reserved successfully');
        console.log('Appointment reserved successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error reserving appointment:', error);
    }
  };

  return (
    <div>
      <h2>Available Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p>Date: {appointment.date}</p>
              <p>Hour: {appointment.hour}</p>
              <p>Status: {appointment.status}</p>
              {/* Add more appointment details as needed */}
              <button onClick={() => reserveAppointment(appointment._id)}>Reserve</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No available appointments.</p>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewAppointments;
