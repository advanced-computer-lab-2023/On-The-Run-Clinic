import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , Link} from 'react-router-dom';
import PatientDetails from '../components/PatientDetails'; // Adjust the path as needed


const MyPatients = () => {
  const { username } = useParams();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchByAppointment, setSearchByAppointment] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDocpatients/${username}`);
        console.log(response.data);

        if (response.status === 200) {
          setPatients(response.data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [username]);


  const getDoctorIdByUsername = async (usernametosearch) => {
    try {
      // Make an API request to get all doctor information
      const response = await axios.get('http://localhost:4000/getDoctors');
  
      if (response.status === 200) {
        const allDoctors = response.data;
  
        // Find the doctor with the matching username
        const doctor = allDoctors.find((doc) => doc.username === usernametosearch);
  
        if (doctor) {
          // Extract the ID of the doctor
          const doctorId = doctor._id;
  
          return doctorId; // Return the doctor's ID
        } else {
          // If no doctor with the username is found, return null or handle as needed
          return null;
        }
      } else {
        // Handle API response errors
        console.error('Error fetching doctors:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return null;
    }
  };
  


const handlePatientSelect = (selectedPatient) => {
  setSelectedPatient(selectedPatient);
};
  


  const handleSearchByName = () => {
    const filteredPatientsByName = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchName.toLowerCase()) 
    );
    return filteredPatientsByName;
  };

  const handleSearchByAppointment = async () => {
    try {
      // Make an API request to get all appointments
      const response = await axios.get('http://localhost:4000/getAllAppointments');
  
      if (response.status === 200) {
        const allAppointments = response.data;
  
        const searchDate = new Date(searchByAppointment);
        console.log("date"+searchDate);
  
        // Retrieve the doctorId asynchronously
        const doctorId = await getDoctorIdByUsername(username);
  
        // Filter appointments based on date and doctorId
        const filteredAppointments = allAppointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          console.log("app date"+ appointmentDate);
  
          // Check if the appointment matches the date and doctorId
          return (
            appointmentDate.toDateString() === searchDate.toDateString() &&
            appointment.doctorId === doctorId
          );
        });
  
        // Extract patient IDs from the filtered appointments
        const patientIds = filteredAppointments.map((appointment) => appointment.patientId);
  
        // Make an API request to get all patient information
        const patientInfoResponse = await axios.get('http://localhost:4000/getPatients');
  
        if (patientInfoResponse.status === 200) {
          const allPatients = patientInfoResponse.data;
  
          // Filter patient information based on patient IDs in filteredAppointments
          const filteredPatientInfo = allPatients.filter((patient) =>
            patientIds.includes(patient._id)
          );
  
  
          return filteredPatientInfo;
        }
      }
    } catch (error) {
      console.error('Error fetching appointments or patient information:', error);
    }
  
    // Return an empty array in case of an error or no matching appointments
    return [];
  };
  
  
  
  
  
  const handleSearchNameButton = () => {
    const filteredPatients = searchName ? handleSearchByName() : patients;
    setPatients(filteredPatients);
  };

  const handleSearchAppointmentButton = async () => {
    const filteredPatients = searchByAppointment ? await handleSearchByAppointment() : patients;
    console.log("test"+filteredPatients);
    setPatients(filteredPatients);
  };

  return (
    <div>
      <h1>Patients of {username}</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearchNameButton}>Search by Name</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search by appointment (e.g., 'YYYY-MM-DD')"
          value={searchByAppointment}
          onChange={(e) => setSearchByAppointment(e.target.value)}
        />
        <button onClick={handleSearchAppointmentButton}>Search by Appointment</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {patients.length > 0 ? (
  <ul>
    {patients.map((patient) => {

  return (
    <li
      key={patient._id} // Make sure patient._id is unique
      //onClick={() => handlePatientSelect(patient)}
      style={{ cursor: 'pointer' }}
    >
       <Link to={`/patient-details/${patient.username}`}>
      Name: {patient.name}<br />
      Username: {patient.username}<br />
      </Link>
    </li>
  );
})}
  </ul>
) : (
  <p>No Patients found.</p>
)}

        </div>
      )}
      {selectedPatient && <PatientDetails patient={selectedPatient} />}
    </div>
  );
};

export default MyPatients;
