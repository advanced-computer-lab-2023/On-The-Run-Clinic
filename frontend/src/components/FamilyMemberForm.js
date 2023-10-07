import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';

const FamilyMemberFormForm = () => {
  const navigate = useNavigate();


const[name,setName]=useState('')
const[national_id,setNational_id]=useState('')
const[age,setAge]=useState('')
const[gender,setGender]=useState('')
const[relation,setRelation]=useState('')
const { username } = useParams();

const[error,setError]=useState(null)
const [isDoctorRegistered, setIsDoctorRegistered] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mem={name,national_id,age,gender,relation,patientUsername:username}
    try{const response = await axios.post('http://localhost:4000/addFamilyMember', mem);
    
    if (response.status === 201) {
      console.log('Registration successful:', response.data);
      setName('')
      setNational_id('')
      setAge('')
      setRelation('')
     
      setError(null)
      // You can handle redirection or other actions here
      navigate(`/dashboard/patient/${username}`);
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
      {isDoctorRegistered && <p>Registration successful! You can now log in.</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        
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
          <label htmlFor="national_id">national_id</label>
          <input
            type="text"
            id="national_id"
            name="national_id"
            value={national_id}
            onChange={(e)=>setNational_id(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="age">age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={(e)=>setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">gender</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => {
              
              setGender(e.target.value);
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="relation">relation Rate</label>
          <input
            type="text"
            id="relation"
            name="relation"
            value={relation}
            onChange={(e)=> {
            setRelation(e.target.value);}}
            required
          />
        </div>
        <button type="submit">ADD</button>
      </form>
    </div>
  );
};

export default FamilyMemberFormForm;
