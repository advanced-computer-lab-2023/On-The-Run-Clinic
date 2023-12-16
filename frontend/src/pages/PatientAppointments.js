import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import AppointmentsModalP from '../components/AppointmentsModalPatient';
import AppointmentForm from '../components/AppointmentForm';
import FilterPanel from '../components/filterPanel';
import Modal from 'react-modal';
import BeatLoader from "react-spinners/BeatLoader";
import FollowUpModal from '../components/FollowUpModalPatient';
const PatientAppointment = () => {
    const { username } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUpcoming, setSelectedUpcoming] = useState(false); // New state for upcoming filter
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedPast, setSelectedPast] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState("");
    const [activeAppointmentId, setAppointmentId] = useState(null);
    const [patient, setPatient] = useState(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const response1 = await axios.get(`http://localhost:4000/search/${username}`, {
                withCredentials: true,
            });
            setPatient(response1.data);
            if (response1.data) {
                const response2 = await axios.get(`http://localhost:4000/getPatientAppointments/${response1.data._id}`, {
                    withCredentials: true,
                });
                setAppointments(response2.data);
                console.log("Appointments:", response2.data);
                setFilteredAppointments(response2.data);
            }

        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
        setIsLoading(false);

    }

    useEffect(() => {
        fetchAppointments();
    }, [username]);

    const handleAppointments = (newAppointments) => {
        setAppointments(newAppointments);
        fetchAppointments();
    };
    const handleDateFilterChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        filterAppointments(selectedDate, selectedStatus, selectedUpcoming);
        fetchAppointments();
    };

    const handleStatusFilterChange = (event) => {
        const selectedStatus = event.target.value;
        setSelectedStatus(selectedStatus);
        filterAppointments(selectedDate, selectedStatus, selectedUpcoming, selectedPast);
        fetchAppointments();
    };

    const handleUpcomingFilterChange = () => {
        const isUpcoming = !selectedUpcoming;
        setSelectedUpcoming(isUpcoming);
        filterAppointments(selectedDate, selectedStatus, isUpcoming, selectedPast);
        fetchAppointments();
    };

    const handlePastFilterChange = () => {
        const isPast = !selectedPast;
        setSelectedPast(isPast);
        filterAppointments(selectedDate, selectedStatus, selectedUpcoming, isPast);
        fetchAppointments();
    };

    const resetFilters = () => {
        setSelectedDate('');
        setSelectedStatus('');
        setSelectedUpcoming(false);
        setFilteredAppointments(appointments);
        setSelectedPast(false)// Reset filters to show all appointments
    };
    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await axios.put(`http://localhost:4000/cancelAppointment/${appointmentId}`);

            if (response.status === 200) {
                const updatedAppointments = appointments.map((appointment) => {
                    if (appointment._id === appointmentId) {
                        return { ...appointment, status: 'Cancelled' };
                    }

                    return appointment;
                });

                setAppointments(updatedAppointments);
                setFilteredAppointments(updatedAppointments);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    const filterAppointments = async (date, status, upcoming, past) => {
        console.log('filterAppointments function called');

        const filtered = appointments.filter((appointment) => {
            console.log(appointment)
            const appointmentDate = new Date(appointment.date);
            const currentDate = new Date();

            if (!date && !status && !upcoming && !past) {
                return true; // No filters applied, return all appointments
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

        const appointmentsWithPatients = await Promise.all(
            filtered.map(async (appointment) => {
                try {
                    if (appointment.patientId != null) {
                        const response = await axios.get(`http://localhost:4000/getPatient/${appointment.patientId}`, {
                            withCredentials: true
                        });
                        if (response.status === 200) {
                            const patientData = response.data;
                            console.log("Appointment Data:", appointment);
                            console.log("Patient Data:", patientData);

                            // Combine appointment and patient details
                            const appointmentWithPatient = { ...appointment, patientInfo: patientData };
                            console.log("both:", appointmentWithPatient);

                            return appointmentWithPatient;
                        }

                    }

                } catch (error) {
                    console.error('Error fetching patient details:', error);
                }
                return appointment; // In case of an error, keep the original appointment data
            })
        );

        console.log("Appointments with Patients:", appointmentsWithPatients);

        setFilteredAppointments(appointmentsWithPatients);
    };

    const handleFollowUpSubmit = () => {
        // You may perform any necessary actions here before closing the modal
        setIsModalOpen(false);
      };
      const handleCloseFollowUpModal = () => {
        setIsModalOpen(false);
      };
    

    return (


        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {isFilterVisible && (
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
                    {isFilterVisible && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', padding: '10px', backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
                                <div style={{ margin: '10px' }}>
                                    <label>Date Filter:</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateFilterChange}
                                    />
                                </div>
                                <div style={{ margin: '10px' }}>
                                    <label>Status Filter:</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusFilterChange}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <option value="">All</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div style={{ margin: '10px' }}>
                                    <label>Upcoming Filter:</label>
                                    <input
                                        type="radio"
                                        name="timeFilter"
                                        checked={selectedUpcoming}
                                        onChange={handleUpcomingFilterChange}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </div>
                                <div style={{ margin: '10px' }}>
                                    <label>Past Filter:</label>
                                    <input
                                        type="radio"
                                        name="timeFilter"
                                        checked={selectedPast}
                                        onChange={handlePastFilterChange}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </div>
                                <button onClick={resetFilters} style={{ margin: '10px', padding: '10px', backgroundColor: '#14967f', color: 'white', border: 'none', borderRadius: '5px' }}>Reset Filters</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {isLoading ? (
                <div className="spinner-container">
                    <BeatLoader color="#14967f" size={15} />
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="spinner-container">
                    <button onClick={() => navigate(-1)} style={{ display: 'inline-block', marginBottom: '10px', color: 'black', backgroundColor: 'transparent', padding: '10px', borderRadius: '5px', border: 'none' }}>
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </button>
                    <p>No appointments found.</p>
                </div>
            ) : (
                <div className="container">
                    <div className="patients-list">
                        <h2 style={{ marginBottom: '20px' }}>
                            <button onClick={() => navigate(-1)} style={{ display: 'inline-block', marginBottom: '10px', color: 'black', backgroundColor: 'transparent', padding: '10px', borderRadius: '5px', border: 'none' }}>
                                <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                            </button>
                            {username}'s Appointments
                            <FontAwesomeIcon
                                className="filter-icon"
                                icon={faFilter}
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                                style={{ color: '#14967f' }}
                            />

                        </h2>
                        <ul className="patients-list">
                            {filteredAppointments.map((a) => (
                                <li key={a._id}>
                                    <div className="patients-header">
                                        <div style={{ flex: 2, textAlign: 'left' }}>
                                            <strong>Date: </strong>  {new Date(a.date).toLocaleDateString('en-GB')}
                                        </div>
                                        <div style={{ flex: 3, textAlign: 'left' }}>
                                            <strong>ID: </strong>{a._id}
                                        </div>
                                        <div style={{ flex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {new Date(a.date) > new Date() && a.status === 'Scheduled' && (
                                                <div style={{ display: 'inline-block' }}>
                                                    <button className="cancel-button" style={{ marginRight: '30px' }} onClick={() => {
                                                        setAppointmentId(a._id);
                                                        setIsConfirmModalOpen(true)
                                                    }}>Cancel</button>
                                                    <Link to={`/reschedule/${a._id}`}>
                                                        <button className="reschedule-button">Reschedule</button>
                                                    </Link>
                                                </div>
                                            )}
                                            {new Date(a.date) < new Date() && a.status === 'Scheduled' && (
                                                <div style={{ display: 'inline-block', marginRight:'70px'}}>

                                                   
                                                        <button className="reschedule-button" onClick={() => {
                                                            setAppointment(a);
                                                            setIsModalOpen(true)
                                                        }}>request follow-up</button>
                                                  
                                                </div>
                                            )}
                                            
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                                            <FontAwesomeIcon
                                                className="view-icon"
                                                icon={faEye}
                                                onClick={() => {
                                                    
                                                    setAppointmentId(a._id);
                                                    setAppointment(a);
                                                    setModalOpen(true);
                                                }}
                                            />

                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                    {modalOpen && appointment && patient &&
                        <AppointmentsModalP
                            setOpenModal={setModalOpen}
                            appointment={appointment}
                            patient={patient}
                        />
                    }
                    {isModalOpen && (
                        <FollowUpModal app={appointment.doctorId} onSubmit={handleFollowUpSubmit} onClose={handleCloseFollowUpModal} />
                    )}
                </div>

            )}













            <Modal
                isOpen={isConfirmModalOpen}
                onRequestClose={() => setIsConfirmModalOpen(false)}
                contentLabel="Confirm Delete"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#f4f4f4',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                }}
            >
                <h2 style={{ color: '#333', marginBottom: '20px' }}>Confirm Cancellation</h2>
                <p style={{ color: '#555', marginBottom: '30px' }}>Are you sure you want to cancel this appointment?</p>

                <div>
                    <button style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: 'crimson', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => {
                        cancelAppointment(activeAppointmentId)
                        setIsConfirmModalOpen(false);
                    }}>
                        Yes
                    </button>
                    <button style={{ padding: '10px 20px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => setIsConfirmModalOpen(false)}>
                        No
                    </button>
                </div>
            </Modal>
        </div>

    )
}
export default PatientAppointment
