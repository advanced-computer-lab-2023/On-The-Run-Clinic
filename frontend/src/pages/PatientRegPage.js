import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const PatientRegistrationForm = () => {
  const navigate = useNavigate();

const[username,setUsername]=useState('')
const[name,setName]=useState('')
const[email,setEmail]=useState('')
const[password,setPassword]=useState('')
const[date_of_birth,setDateOfBirth]=useState('')
const[gender,setGender]=useState('')
const[mobileNumber,setMobileNumber]=useState('')
const [emergencyContact, setEmergencyContact] = useState({
    fullName: '',
    mobileNumber: '',
  });

  const [error, setError] = useState(null);
  const [isPatientRegistered, setIsPatientRegistered] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p={username,name,email,password,date_of_birth,gender,mobileNumber,emergencyContact}
    try{const response = await axios.post('http://localhost:4000/register/patient', p);
    
    if (response.status === 201) {
        console.log('Registration successful:', response.data);
        setUsername('');
        setName('');
        setEmail('');
        setPassword('');
        setDateOfBirth('');
        setGender('Male');
        setMobileNumber('');
        setEmergencyContact({ fullName: '', mobileNumber: '' });
        setError(null);
        setIsPatientRegistered(true);
      } else {
        console.error('Registration failed:', response.data);
        setError('Registration failed. Please check your data and try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again later.');
    }
    
  };

  
  return (
    <div>
      <h2>Patient Registration</h2>
      {isPatientRegistered && <p>Registration successful! You can now log in.</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e)=>setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={date_of_birth}
            onChange={(e) => {
              
              setDateOfBirth(e.target.value);
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="emergencyFullName">Emergency Contact Full Name</label>
          <input
            type="text"
            id="emergencyFullName"
            name="emergencyFullName"
            value={emergencyContact.fullName}
            onChange={(e) =>
              setEmergencyContact({
                ...emergencyContact,
                fullName: e.target.value,
              })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="emergencyMobileNumber">Emergency Contact Mobile Number</label>
          <input
            type="text"
            id="emergencyMobileNumber"
            name="emergencyMobileNumber"
            value={emergencyContact.mobileNumber}
            onChange={(e) =>
              setEmergencyContact({
                ...emergencyContact,
                mobileNumber: e.target.value,
              })
            }
            required
          />
        </div>
        <button type="submit">Register as Patient</button>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;