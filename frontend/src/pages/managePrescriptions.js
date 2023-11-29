import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


import MedicineSelect from '../components/MedicineList';
import PrescriptionList from '../components/PrescriptionList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import PrescriptionDetailsModal from '../components/PrescriptionDetailsModal';
import PrescriptionForm from '../components/PrescriptionForm';

const ManagePrescriptions = () => {
  const { username, usernameDoctor } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  const [prescription, setPrescription] = useState("");
  const [activePrescriptionId, setActivePrescriptionId] = useState(null);



  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getMyPrescriptions/${username}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          console.log("P", response.data)
          setPrescriptions(response.data);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };
    fetchPrescriptions();
  }, [username]);




  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%', float: 'left' }}>
          <h2>
            Prescriptions
            <FontAwesomeIcon
              icon={faPlus}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
              onClick={() => setIsFormVisible(true)}
            />
          </h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {prescriptions.map((prescription) => (
              <li key={prescription._id} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                  <span><strong>Date: </strong>  {new Date(prescription.date).toLocaleDateString('en-GB')}</span>
                  <FontAwesomeIcon
                    icon={faEye}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => {
                      setModalOpen(true);
                      setActivePrescriptionId(prescription._id)
                      setPrescription(prescriptions.find((p) => p._id === activePrescriptionId));
                    }}
                  />
                </div>
                <div style={{ fontSize: '1.2rem', marginTop: '10px' }}><strong>Id: </strong> {prescription._id}</div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: '45%', float: 'right' }}>
          {isFormVisible && <PrescriptionForm />}
        </div>
        {modalOpen && prescription &&


<PrescriptionDetailsModal
  setOpenModal={setModalOpen}


  prescription={prescription}
/>}
      </div>
      </>

     
  



  )
}
export default ManagePrescriptions
