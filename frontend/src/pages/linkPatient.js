import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import axios from 'axios';

function LinkPatientPage() {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username:username,
    email: '',
    mobileNumber:'',
    relation: '',
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch family members when the component mounts
    async function fetchFamilyMembers() {
      try {
        const response = await axios.get(`http://localhost:4000/getLinkedFamilyMembers/${username}`);
        if (response.status === 200) {
          setFamilyMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
        // You can set an error state or display an error message to the user here.
      }
      finally {
        setLoading(false);
      }
    }
  
    fetchFamilyMembers();
  }, [username]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
        username: formData.username,
        relation: formData.relation,
      };
    
      // Check if the emailOrMobile field is not empty, and if so, add it to the requestData
      if (formData.email.trim() !== '') {
        requestData.email = formData.email;
      }
      if (formData.mobileNumber.trim() !== '') {
        requestData.mobileNumber = formData.mobileNumber;
      }

    try {
      const response = await axios.post('http://localhost:4000/linkMember', requestData);
      if (response.status === 200) {
        alert('Patient linked successfully.');
        // You can navigate to another page or update the UI as needed.
      }
    } catch (error) {
      console.error('Error linking patient:', error);
      alert('An error occurred while linking the patient.');
    }
  };

  return (
    <div>
      <h1>Link Patient Account as Family Member</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patientId">Enter Patient Mobile Number:</label>
          <input
            type="text"
            id="patientId"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="linkedPatientInput">Enter Patient Email:</label>
          <input
            type="text"
            id="linkedPatientInput"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="relation">Relation to the Patient:</label>
          <select
            id="relation"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            required
          >
            <option value="">Select Relation</option>
            <option value="Wife">Wife</option>
            <option value="Husband">Husband</option>
            <option value="Child">Child</option>
          </select>
        </div>
        <button type="submit">Link Patient</button>
      </form>
      <h1>Family Members of {username}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : familyMembers.length > 0 ? (
        <ul>
          {familyMembers.map((familyMember) => (
            <li key={familyMember._id}>
              Name: {familyMember.linkedPatientName}<br />
              
              Relation: {familyMember.linkedPatientRelation}<br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No family members found.</p>
      )}
      


    </div>
  );
}

export default LinkPatientPage;
