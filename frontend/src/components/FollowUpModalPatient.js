// FollowUpModal.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FollowUpModal = ({app, onSubmit, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const { username } = useParams();
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setPatient(response.data);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDoc/${app}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setDoctor(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchPatientData();
    fetchDoctorData();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const pid = patient._id;
      const did = doctor._id;
      const hour = parseInt(time.split(':')[0], 10);
      const appointmentData = { patientId: pid, doctorId: did, date: date, status: 'Pending', description, hour };

      const response = await axios.post(`http://localhost:4000/createFollowUpReq`, appointmentData, {
        withCredentials: true,
      });

      console.log('Appointment created successfully');
      onSubmit(); // Notify the parent component about the successful submission
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <h2 style={modalTitleStyle}>Schedule Follow-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle} />
          </div>
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Time:</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required style={inputStyle} />
          </div>
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={textareaStyle} />
          </div>
          <button type="submit" style={submitBtnStyle}>
            Submit
          </button>
        </form>
        <button onClick={onClose} style={closeBtnStyle}>
          Close
        </button>
      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  maxWidth: '400px',
  width: '100%',
};

const modalTitleStyle = {
  fontSize: '1.5em',
  marginBottom: '15px',
};

const formGroupStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const textareaStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const submitBtnStyle = {
  width: '100%', // Center the button
  padding: '8px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#007bff',
  color: '#fff',
};

const closeBtnStyle = {
  width: '100%', // Center the button
  padding: '8px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#6c757d',
  color: '#fff',
  marginTop: '15px',
};

export default FollowUpModal;
