import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PatientDetails from '../components/PatientDetails'; // Adjust the path as needed

const MyPatients = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [originalPatients, setOriginalPatients] = useState([]); // Store original patient data
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [description1, setDescription] = useState('');
  const [hours, setHours] = useState({});
  const [dates, setDates] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const getDoctorByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:4000/getDoctorByUsername/${username}`,{
        withCredentials: true
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
    }
  };
  const [doctor1, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      const doctorData = await getDoctorByUsername(username); // replace 'username' with the actual username
      setDoctor(doctorData);
    };

    fetchDoctor();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDocpatients/${username}`,{
          withCredentials: true
        });
        //console.log(response.data);

        if (response.status === 200) {
          setPatients(response.data);
          setOriginalPatients(response.data); // Store original patient data
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [username]);

  const handleSearchByName = () => {
    const filteredPatientsByName = originalPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchName.toLowerCase())
    );
    return filteredPatientsByName;
  };


  const handleSearchNameButton = () => {
    const filteredPatients = searchName ? handleSearchByName() : originalPatients; // Use original patients for filtering
    setPatients(filteredPatients);
  };







  const handleScheduleFollowUp = async (patientId, doctorId, date, status, description) => {
    try {

      const f = { patientId, doctorId, date, status, description, hour }
      const response = await axios.post(`http://localhost:4000/createAppointment`, f,{
        withCredentials: true
      });
      if (response.status === 200) {
        console.log('Appointment created successfully');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };


  const handleResetFilterButton = () => {
    setSearchName('');
    setPatients(originalPatients); // Reset patients to original data
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
        <button onClick={handleResetFilterButton}>Reset Filter</button>
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
                      Name: {patient.name}
                      <br />
                      Username: {patient.username}
                      <br />
                    </Link>
                    <input
                      type="date"
                      value={dates[patient._id] || ''}
                      onChange={e => setDates({ ...dates, [patient._id]: e.target.value })} />
                    <input
                      type="text"
                      value={descriptions[patient._id] || ''}
                      onChange={e => setDescriptions({ ...descriptions, [patient._id]: e.target.value })}
                      placeholder="Description" />
                    <input
                      type="text"
                      value={hours[patient._id] || ''}
                      onChange={e => setHours({ ...hours, [patient._id]: e.target.value })}
                      placeholder="Hour"
                    />


                    <button
                      onClick={() => handleScheduleFollowUp(patient._id, doctor1._id, dates[patient._id], 'Scheduled', descriptions[patient._id])}>Schedule Follow Up</button>

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
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default MyPatients;
