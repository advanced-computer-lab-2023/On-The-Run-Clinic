import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    // Make an API request to fetch family members' data
    axios.get('http://localhost:4000/getFamilyMembers')
      .then((response) => {
        // Set the fetched data in the state
        setFamilyMembers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching family members:', error);
      });
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h2>Registered Family Members</h2>
      <ul>
        {familyMembers.map((member) => (
          <li key={member._id}>
            <p>Name: {member.name}</p>
            <p>National ID: {member.nationalID}</p>
            <p>Age: {member.age}</p>
            <p>Gender: {member.gender}</p>
            <p>Relation to Patient: {member.relation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FamilyMembers;