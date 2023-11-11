import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const DoctorRegistrationForm = () => {
  const navigate = useNavigate();

const[username,setUsername]=useState('')
const[name,setName]=useState('')
const[email,setEmail]=useState('')
const[password,setPassword]=useState('')
const[date_of_birth,setDateOfBirth]=useState('')
const[hourly_rate,setHourlyRate]=useState('')
const[Affiliation,setAffiliation]=useState('')
const[educational_background,setEducational_background]=useState('')
const[speciality,setSpeciality]=useState('')
const [reqDocs, setReqDocs] = useState([]); // New state variable for the file

const[error,setError]=useState(null)
const [isDoctorRegistered, setIsDoctorRegistered] = useState(false);
const [isRequestPending, setIsRequestPending] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
          
          const dr={username,name,email,password,date_of_birth,hourly_rate,speciality,Affiliation,educational_background,reqDocs}
    
          try{const response = await axios.post('http://localhost:4000/createRequest', dr);
    
    if (response.status === 201) {
      console.log('Registration successful:', response.data);
      setUsername('')
      setName('')
      setEmail('')
      setPassword('')
      setDateOfBirth('')
      setHourlyRate('')
      setAffiliation('')
      setEducational_background('')
      setReqDocs([])
     
      setIsDoctorRegistered(true); // Set registration success
      setIsRequestPending(true); // Set request as pending

      setError(null)
      // You can handle redirection or other actions here
     // navigate(`/dashboard/doctor/${username}`);
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
      {error && <p>{error}</p>}
      {isRequestPending ? (
        <p>Registration request is pending. Please wait for approval.</p>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="text"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="text"
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
              <label htmlFor="hourlyRate">Hourly Rate</label>
              <input
                type="text"
                id="hourlyRate"
                name="hourlyRate"
                value={hourly_rate}
                onChange={(e) => {
                  setHourlyRate(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="Affiliation">affiliation</label>
              <input
                type="text"
                id="Affiliation"
                name="Affiliation"
                value={Affiliation}
                onChange={(e) => {
                  setAffiliation(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="educational_background">educational background</label>
              <input
                type="text"
                id="educational_background"
                name="educational_background"
                value={educational_background}
                onChange={(e) => {
                  setEducational_background(e.target.value);
                }}
                required
              />
            </div>  
            <div>
              <label htmlFor="speciality">Speciality</label>
              <input
                type="text"
                id="speciality"
                name="speciality"
                value={speciality}
                onChange={(e) => {
                  setSpeciality(e.target.value);
                }}
                required
              />
            </div>    
            <div >
            <input type="file" multiple onChange={e => setReqDocs(Array.from(e.target.files))} />
            </div>
           
            
            <button type="submit">Register as Doctor</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DoctorRegistrationForm;

//  this is a doctor page
