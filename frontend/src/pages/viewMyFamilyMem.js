import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';

const FamilyMembersList = () => {
  const { username } = useParams();
  const navigate=useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
       
        const response = await axios.get(`http://localhost:4000/getFamilyMem/${username}`);
        console.log(response.data);

        if (response.status === 200) {
          setFamilyMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [username]);

  return (
    <div>
      <h1>Family Members of {username}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : familyMembers.length > 0 ? (
        <ul>
          {familyMembers.map((familyMember) => (
            <li key={familyMember._id}>
              Name: {familyMember.name}<br />
              National ID: {familyMember.national_id}<br />
              Age: {familyMember.age}<br />
              Gender: {familyMember.gender}<br />
              Relation: {familyMember.relation}<br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No family members found.</p>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default FamilyMembersList;