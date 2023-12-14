// PrescriptionDetailsModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Set the root element for accessibility

const AppointmentsModalP = ({ setOpenModal, appointment, patient }) => {
    const [doctor, setDoctor] = useState(null);

    const fetchDoctor = async () => {
        try {
            if (appointment.doctorId === null) {
                return;
            }
            const response = await axios.get(`http://localhost:4000/getDoc/${appointment.doctorId}`, { withCredentials: true });
            setDoctor(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }

    }
    useEffect(() => {
        fetchDoctor();
    }, [appointment]);

    return (

        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        X
                    </button>
                </div>
                <div className='title' style={{ marginBottom: '50px' }}>
                    <h1>Appointment Details</h1>
                </div>
                <div className="metadata" style={{}}>
                    <p style={{ fontSize: '20px', marginBottom: '40px' }}><strong>ID: </strong>{appointment._id}</p>
                    <p style={{ fontSize: '20px', marginBottom: '40px' }}><strong>Date: </strong>{new Date(appointment.date).toLocaleDateString('en-GB')}</p>
                    <p style={{ fontSize: '20px', marginBottom: '40px' }}><strong>Status: </strong>{appointment.status}</p>
                    {doctor && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                                <strong>Doctor:  </strong>{doctor.name}
                                <Link to={`/doctor-details/${doctor.username}/${patient.username}`}>
                                    <FontAwesomeIcon icon={faEye} style={{ marginLeft: '10px' }} />
                                </Link>
                            </div>
                        </>
                    )}
                </div>




            </div>
        </div>
    );
};

export default AppointmentsModalP;
