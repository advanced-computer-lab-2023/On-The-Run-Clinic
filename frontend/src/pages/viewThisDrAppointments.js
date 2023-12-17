import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/Stripe';
import { loadStripe } from '@stripe/stripe-js';
import BeatLoader from "react-spinners/BeatLoader";


const stripePromise = loadStripe('your-publishable-key');

const ViewDRAppointments = () => {
    const { doctorUsername, patientUsername } = useParams();
    const [patient, setPatient] = useState('')
    const navigate = useNavigate();
    const [doctorId, setDoctorId] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientId, setPatientId] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState([null]);
    const [selectedLinkedPatient, setSelectedLinkedPatient] = useState(null);
    const [step, setStep] = useState(1);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [formData, setFormData] = useState({
        selectedAppointment: '', // Store the selected package ID
        paymentMethod: 'creditCard',
        username: patientUsername,
    });
    const handleNext = () => {
        setStep(step + 1);
    };
    useEffect(() => {
        const fetchDoctorId = async () => {
            try {
                const response = await axios.get('http://localhost:4000/getDoctors', {
                    withCredentials: true
                });
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
                const response = await axios.get(`http://localhost:4000/getPatientByUsername/${patientUsername}`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setPatientId(response.data._id);
                    setPatient(response.data);
                    console.log(patientId);
                }
            }
            catch (error) {
                console.error('Error fetching Patient', error);
            }
        }

        const fetchAppointments = async () => {
            setIsFetching(true);
            try {
                if (doctorId) {
                    const response = await axios.get(`http://localhost:4000/getAvailableDoctorAppointments/${doctorId}`, {
                        withCredentials: true
                    });
                    if (response.status === 200) {
                        setAppointments(response.data);
                        setIsFetching(false);
                        console.log(response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
               
                setLoading(false);
            }
        };

        const fetchFamilyMembers = async () => {
            try {

                const response = await axios.get(`http://localhost:4000/getFamilyMem/${patientUsername}`, {
                    withCredentials: true
                });
                console.log(response.data);

                if (response.status === 200) {
                    setFamilyMembers(response.data);
                }
            } catch (error) {
                console.error('Error fetching family members:', error);
            }
        };

        fetchDoctorId();
        fetchPatientId();
        fetchAppointments();
        fetchFamilyMembers();
    }, [doctorUsername, doctorId]);

    const reserveAppointment = async (appointmentId) => {
        try {
            console.log("APP ID " + appointmentId);
            const response = await axios.post(`http://localhost:4000/reserveAppointment/${appointmentId}`, {
                patientId,
                status: 'Scheduled',
                description: 'Checkup',
                paymentMethod: formData.paymentMethod
            }, {
                withCredentials: true
            });
            if (response.status === 200) {
                // Handle success, maybe show a success message or update the UI
                setPaymentSuccess(true);
                setTimeout(() => {
                    navigate(`/filterAppointmentsPatient/${patientUsername}`);
                }, 2000);
            }
        } catch (error) {
            console.error('Error reserving appointment:', error);
        }
    };

    const reserveFamilyMemberAppointment = async (appointmentId) => {
        try {
            console.log("APP ID" + appointmentId);
            console.log("Request Data:", {
                patientId,
                status: 'Scheduled',
                description: 'Checkup',
                familyMemberId: selectedFamilyMember,
                paymentMethod: formData.paymentMethod,
            });
            const response = await axios.post(`http://localhost:4000/reserveFamilyMemberAppointment/${appointmentId}`, {
                patientId,
                status: 'Scheduled',
                description: 'Checkup',
                familyMemberId: selectedFamilyMember,
                paymentMethod: formData.paymentMethod
            }, {
                withCredentials: true
            });
            if (response.status === 200) {
                setPaymentSuccess(true);
                setTimeout(() => {
                    navigate(`/filterAppointmentsPatient/${patientUsername}`);
                }, 2000);

            }
        }
        catch (error) {
            console.error('Error reserving appointment:', error);
        }
    };

    const reserveLinkedPatientAppointment = async (appointmentId) => {
        try {
            console.log("APP ID " + appointmentId);
            console.log("Request Data:", {
                patientId,
                status: 'Scheduled',
                description: 'Checkup',
                linkedPatientId: selectedLinkedPatient,
                paymentMethod: formData.paymentMethod,
            });

            const response = await axios.post(`http://localhost:4000/reserveLinkedPatientAppointment/${appointmentId}`, {
                patientId,
                status: 'Scheduled',
                description: 'Checkup',
                linkedPatientId: selectedLinkedPatient,
                paymentMethod: formData.paymentMethod,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setPaymentSuccess(true);
                setTimeout(() => {
                    navigate(`/filterAppointmentsPatient/${patientUsername}`);
                }, 2000);
            }
        } catch (error) {
            console.error('Error reserving appointment:', error);
        }
    };
    const handleSubmit = () => {

        if (selectedFamilyMember) {
            reserveFamilyMemberAppointment(selectedAppointment);
        } else if (selectedLinkedPatient) {
            reserveLinkedPatientAppointment(selectedAppointment);
        } else {
            reserveAppointment(selectedAppointment);
        }
    };
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div>
            <h2 style={{ marginTop: '20px', marginLeft: '20px', weight: '600' }}>Book Appointment</h2>

            <div className="d-flex justify-content-center align-items-center">

                <div className="Container" style={{ width: '960px', marginTop: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', padding: '40px', height: '500px' }}>
                    <div>
                        <h2>Step {step}</h2>

                        {step === 2 && <p style={{ color: '#14967f' }}>Choose who you are booking the appointment for.</p>}
                        {step === 3 && <p style={{ color: '#14967f' }}>Select your preferred payment method and complete the payment details.</p>}
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                    {step === 1 && (
                        <>

                            {isFetching ? (
                                <BeatLoader color={"#123abc"} loading={loading} size={15} />
                            ) : appointments.length > 0 ? (
                                <ul className="list-group">
                                    <p style={{ color: '#14967f' }}>Select an available appointment from the list below.</p>

                                    <div className="row">
                                        {appointments.map((appointment) => (
                                            <div className="col-md-4">
                                                <div key={appointment._id} className={`list-group-item ${selectedAppointment === appointment._id ? 'active' : ''}`} onClick={() => setSelectedAppointment(appointment._id)}>
                                                    <p>Date: {new Date(appointment.date).toLocaleDateString('en-GB')}</p>
                                                    <p>Hour: {appointment.hour}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ul>
                            ) : (
                                <div>
                                    <p>No available appointments. </p>
                                    <p><Link to={`/viewDoctors/${patientUsername}`}>View Other Doctors</Link> </p>
                                </div>
                            )}
                            <button className="next-button" onClick={() => {
                                if (!selectedAppointment) {
                                    setErrorMessage('Please select an appointment.');
                                } else {
                                    setErrorMessage(null);
                                    handleNext();
                                }
                            }}>Next &#8594;</button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <form>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="self"
                                        checked={formData.paymentFor === 'self'}
                                        onChange={() => {
                                            setFormData({ ...formData, paymentFor: 'self' });
                                            setSelectedLinkedPatient(null);
                                            setSelectedFamilyMember(null);
                                        }}
                                        id="payForSelf"
                                    />
                                    <label className="form-check-label" htmlFor="payForSelf">
                                        Pay for myself
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="family"
                                        checked={formData.paymentFor === 'family'}
                                        onChange={() => {
                                            setFormData({ ...formData, paymentFor: 'family' })
                                            setSelectedLinkedPatient(null);
                                        }

                                        }
                                        id="payForFamily"
                                    />
                                    <label className="form-check-label" htmlFor="payForFamily">
                                        Pay for a family member
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="linkedFamily"
                                        checked={formData.paymentFor === 'linkedFamily'}
                                        onChange={() => {
                                            setFormData({ ...formData, paymentFor: 'linkedFamily' })
                                            setSelectedFamilyMember(null);
                                        }}
                                        id="payForLinkedFamily"
                                    />
                                    <label className="form-check-label" htmlFor="payForLinkedFamily">
                                        Pay for a linked family member
                                    </label>
                                </div>
                                {formData.paymentFor === 'family' && (
                                    <div className="form-group">
                                        <label htmlFor="familyMemberSelect">Select Family Member:</label>
                                        <select className="form-control" id="familyMemberSelect" onChange={(e) => setSelectedFamilyMember(e.target.value)} style={{ height: '50px' }}>
                                            <option value={null}>Select Family Member</option>
                                            {familyMembers.map((familyMember) => (
                                                <option key={familyMember._id} value={familyMember._id}>
                                                    {familyMember.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {formData.paymentFor === 'linkedFamily' && (
                                    <div className="form-group">
                                        <label htmlFor="linkedFamilyMemberSelect">Select Linked Family Member:</label>
                                        <select className="form-control" id="linkedFamilyMemberSelect" onChange={(e) => setSelectedLinkedPatient(e.target.value)} style={{ height: '50px' }}>
                                            <option value={null}>Select Linked Patient</option>
                                            {patient.linkedPatients.map((linkedPatient) => (
                                                <option key={linkedPatient.linkedPatientId} value={linkedPatient.linkedPatientId}>
                                                    {linkedPatient.linkedPatientName} - {linkedPatient.linkedPatientRelation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </form>
                            <button className="next-button" onClick={() => {
                                if (!formData.paymentFor) {
                                    setErrorMessage('Please select a payment option.');
                                } else if (formData.paymentFor === 'family' && !selectedFamilyMember) {
                                    setErrorMessage('Please select a family member.');
                                } else if (formData.paymentFor === 'linkedFamily' && !selectedLinkedPatient) {
                                    setErrorMessage('Please select a linked family member.');
                                } else {
                                    setErrorMessage(null);
                                    handleNext();
                                }
                            }} disabled={!selectedAppointment}>Next &#8594;</button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                         <p>Your wallet balance is: {patient.wallet}</p>
                            <div className="payment-options">
                                <h3>Select Payment Method</h3>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="wallet"
                                        checked={formData.paymentMethod === 'wallet'}
                                        onChange={() => setFormData({ ...formData, paymentMethod: 'wallet' })}
                                        id="wallet"
                                    />
                                    <label className="form-check-label" htmlFor="wallet">
                                        Pay with wallet
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="creditCard"
                                        checked={formData.paymentMethod === 'creditCard'}
                                        onChange={() => setFormData({ ...formData, paymentMethod: 'creditCard' })}
                                        id="creditCard"
                                    />
                                    <label className="form-check-label" htmlFor="creditCard">
                                        Pay with credit card
                                    </label>
                                </div>
                            </div>
                            {formData.paymentMethod === 'creditCard' && (
                                <div className="payment-info">
                                    <h3>Payment Information</h3>
                                    <Elements stripe={stripePromise}>
                                        <div className="stripe-container">
                                            <PaymentForm />
                                        </div>
                                    </Elements>
                                </div>
                            )}
                            <button className="next-button" onClick={handleSubmit}>Submit</button>
                        </>
                    )}
                    <button className=" back-button" onClick={handleBack} disabled={step === 1}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default ViewDRAppointments;
