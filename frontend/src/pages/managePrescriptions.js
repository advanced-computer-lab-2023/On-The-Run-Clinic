import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import MedicineSelect from '../components/MedicineList';
import PrescriptionList from '../components/PrescriptionList';


const ManagePrescriptions = () => {
  const { username,usernameDoctor } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [isPrescriptionFormVisible, setIsPrescriptionFormVisible] = useState(false);
  const [isaddmed, setIsaddmed] = useState(false);
const [newPrescription, setNewPrescription] = useState({ medicineId: '', dosage: '', instructions: '' });
const [newMed, setNewMed] = useState({ medicineId: '', prescriptionId: '', dosage: 0});
const [activePrescriptionId, setActivePrescriptionId] = useState(null);
const [prescription, setPrescription] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getMedicines', {
          withCredentials: true
        });
        if (response.status === 200) {
          setMedicines(response.data);
          console.log(response.data)
        }
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    
    fetchMedicines();
  }, [username]);
  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getMyPrescriptions2/${username}/${usernameDoctor}`,{
        withCredentials: true
      });
      if (response.status === 200) {
        console.log("P",response.data)
        setPrescriptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };
  
  useEffect(() => {
    
      fetchPrescriptions();
  }, [username]);
  // ManagePrescriptions.js
// ... rest of your code ...

const handleIncrementDosage = async (prescriptionId, medicineId) => {
  try {
    const response = await axios.put(`http://localhost:4000/incrementDosage/${prescriptionId}/${medicineId}`, {}, {
      withCredentials: true
    });
    if(response.status === 200){
      fetchPrescriptions();
    }
  } catch(error){
    console.error('Error incrementing dosage:', error);
  }
  fetchPrescriptions();
};

const handleDecrementDosage = async (prescriptionId, medicineId) => {
  try {
    const response = await axios.put(`http://localhost:4000/decrementDosage/${prescriptionId}/${medicineId}`, {}, {
      withCredentials: true
    });
    if(response.status === 200){
      fetchPrescriptions();
    }
  } catch(error){
    console.error('Error decrementing dosage:', error);
  }
  fetchPrescriptions();
};

// ... rest of your code ...
  const handleAddMedicine = async (prescriptionId) => {
    try{
      console.log("newMed:",prescriptionId)
      const updatedMed = { ...newMed, prescriptionId: prescriptionId };
      const response = await axios.post(`http://localhost:4000/addMedicineToPres/`,updatedMed, {
        withCredentials: true
      });
      if(response.status === 200){
        newMed.medicineId='';
        fetchPrescriptions();
      }
    }
    catch(error){
      console.error('Error adding medicine:', error);
    }
  };
  const handleDeleteMedicine = async(prescriptionId, medicineId) => {
    try {
      console.log("delete",prescriptionId,medicineId)
      const response = await axios.delete(`http://localhost:4000/deleteMedicineFromPres/${prescriptionId}/${medicineId}`,{}, {
        withCredentials: true
      });
      if (response.status === 200) {
        // Remove the deleted medicine from the prescriptions state
        setPrescriptions(prescriptions.map(prescription => 
          prescription._id === prescriptionId 
            ? {...prescription, medicines: prescription.medicines.filter(medicine => medicine._id !== medicineId)}
            : prescription
        ));
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };


  return(
    <>
    <div style={{ width: '50%', float: 'right' }}>
    <h2>Medicines</h2>
      <MedicineSelect
        medicines={medicines}
        selectedMedicine={newMed.medicineId}
        onMedicineChange={(medicineId) => {
          setNewMed({ ...newMed, medicineId: medicineId });
        }}
      />
    </div>
    <div style={{ width: '50%', float: 'left' }}>
    <h2>Prescriptions</h2>
    <PrescriptionList prescriptions={prescriptions} onAddMedicine={handleAddMedicine} onDeleteMedicine={handleDeleteMedicine} onIncrementDosage={handleIncrementDosage} onDecrementDosage={handleDecrementDosage} />
    </div>
    </>
  
  
  
  )
}
export default ManagePrescriptions
