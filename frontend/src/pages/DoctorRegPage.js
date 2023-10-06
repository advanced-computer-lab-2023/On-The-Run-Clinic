import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const DoctorRegistrationForm = () => {
  const navigate = useNavigate();

const[username,setUsername]=useState('')
const[name,setName]=useState('')
const[email,setEmail]=useState('')
const[password,setPassword]=useState('')
const[dateOfBirth,setDateOfBirth]=useState('')
const[hourlyRate,setHourlyRate]=useState('')
const[erro,setError]=useState(null)
const [isDoctorRegistered, setIsDoctorRegistered] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dr={username,name,email,password}
    try{const response = await axios.post('http://localhost:4000/register/doctor', dr);
    
    if (response.status === 201) {
      console.log('Registration successful:', response.data);
      setUsername('')
      setName('')
      setEmail('')
      setPassword('')
      setDateOfBirth('')
      setHourlyRate('')
      setError(null)
      // You can handle redirection or other actions here
      navigate(`/dashboard/doctor/${username}`);
    } else {
      console.error('Registration failed:', response.data);
      // Handle and display errors to the user
    }
  } catch (error) {
    console.error('Registration failed:', error);
    // Handle and display errors to the user
  }
    
  };

  
  return (
    <div>
      <h2>Doctor Registration</h2>
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
            value={dateOfBirth}
            onChange={(e) => {
              const selectedDate = e.target.value;
              // Format the date to YYYY-MM-DD
              setDateOfBirth(selectedDate);
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="hourlyRate">Hourly Rate</label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            value={hourlyRate}
            onChange={(e)=>setHourlyRate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register as Doctor</button>
      </form>
    </div>
  );
};

export default DoctorRegistrationForm;
