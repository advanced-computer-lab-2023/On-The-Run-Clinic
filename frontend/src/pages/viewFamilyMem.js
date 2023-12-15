import { useParams, Link, useNavigate } from 'react-router-dom';
import  {React, useState,useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

import FamMemForm from '../components/FamMemForm';

const ViewFam= () => {
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
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchFamilyMembers = async () => {
    try {
     
      const response = await axios.get(`http://localhost:4000/getFamilyMem/${username}`,{
        withCredentials: true
      });
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
  useEffect(() => {
   
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
      const response = await axios.post('http://localhost:4000/linkMember', requestData,{
        withCredentials: true
      });
      if (response.status === 200) {
    fetchFamilyMembers();
        // You can navigate to another page or update the UI as needed.
      }
    } catch (error) {
      console.error('Error linking patient:', error);
      alert('An error occurred while linking the patient.');
    }
  };
  const handleLinkSuccess = (isLinked) => {
    if (isLinked) {
     fetchFamilyMembers();
     setIsFormVisible(false);
    }
  };


  return (
    <div className="container">
    <div className="prescriptions-list">
      <h2>
        Family Members
        <FontAwesomeIcon
            className="add-icon"
            icon={faPlus}
            onClick={() => setIsFormVisible(true)}
            style={{ color: '#14967f' }}
          />
      </h2>
      <ul>
        {familyMembers.map((prescription) => (
          <li key={prescription._id}>
            <div className="prescription-card">
              <div className="prescription-header">
                <span><strong>Name: </strong>  {prescription.name}</span>
              
              </div>
              <div><strong>Relation: </strong> {prescription.relation}</div>
              <div><strong> National ID:</strong>{prescription.national_id}</div>
              <div><strong> Age: </strong>{prescription.age}</div>

            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="prescription-form">
      {isFormVisible && <FamMemForm onLinkSuccess={handleLinkSuccess} />}
    </div>
   
  </div>
  );
}

export default ViewFam;
