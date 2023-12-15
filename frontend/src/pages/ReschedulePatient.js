import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/Stripe';
import { loadStripe } from '@stripe/stripe-js';
import BeatLoader from "react-spinners/BeatLoader";
import { useAuthContext } from '../hooks/useAuthContext';


const stripePromise = loadStripe('your-publishable-key');

const ReschedulePatient = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [availableAppointments, setAvailableAppointments] = useState([]);
    const [selectedNewAppointment, setSelectedNewAppointment] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/getAppointment/${id}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setAppointment(response.data);
                }
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };

        fetchAppointment();
    }, [id]);

    useEffect(() => {
        if (appointment) {
            const fetchAvailableAppointments = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/getAvailableDoctorAppointments/${appointment.doctorId}`, {
                        withCredentials: true,
                    });

                    if (response.status === 200) {
                        setAvailableAppointments(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching available appointments:', error);
                }
                finally {
                    setLoading(false);
                }
            };

            fetchAvailableAppointments();
        }
    }, [appointment]);
    const handleReschedule = async () => {
        try {

            console.log("o" + id);
            console.log("n" + selectedNewAppointment);
            const response = await axios.post(`http://localhost:4000/rescheduleAppointment`, {
                OldappointmentId: id,
                NewappointmentId: selectedNewAppointment,
            });

            if (response.status === 200) {
                alert('Appointment rescheduled successfully');
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
        }
    };

    return (
        <div>
           

            <div className="d-flex justify-content-center align-items-center">

                <div className="Container" style={{ width: '960px', marginTop: '50px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', padding: '40px', height: '500px' }}>

                    {loading ? (
                        <BeatLoader color={"#123abc"} loading={loading} size={15} />
                    ) : availableAppointments.length > 0 ? (
                        <div>
                      

                              
                                    <ul className="list-group">
                                    <h2 style={{ marginTop: '20px', fontWeight: '600' }}>Reschedule Appointment</h2>
                                        <p style={{ color: '#14967f',marginLeft:'10px' ,fontSize:'15px'}}>Please select an available appointment from the list below.</p>

                                        <div className="row">
                                            {availableAppointments.map((appointment) => (
                                                <div className="col-md-4">
                                                    <div key={appointment._id} className={`list-group-item ${selectedNewAppointment === appointment._id ? 'active' : ''}`} onClick={() => setSelectedNewAppointment(appointment._id)}>
                                                        <p>Date: {new Date(appointment.date).toLocaleDateString('en-GB')}</p>
                                                        <p>Hour: {appointment.hour}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ul>
                                    <button className="next-button" onClick={() => {
                              handleReschedule();
                            }}>Submit reschedule</button>
                               <button className="back-button" onClick={() => navigate(-1)}>Go back</button>
                     

                        </div>
                    ) : (
                        <div>
                               <h2 style={{ marginTop: '20px', fontWeight: '600' }}>Reschedule Appointment</h2>
                              <p style={{ color: 'grey',marginTop:'60px' ,fontSize:'25px',fontWeight:'300'}}>{user.role === 'patient' ? 'Sorry this doctor has no available appointments' : 'You have no available appointments'}</p>
                            <button className="back-button" onClick={() => navigate(-1)}>Go back</button>

                        </div>
                    )}
                     

                </div>
            </div>
        </div>
    );
};

export default ReschedulePatient;
