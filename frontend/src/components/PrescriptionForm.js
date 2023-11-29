import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { useParams } from 'react-router-dom';

function PrescriptionForm() {
    const { username, usernameDoctor } = useParams();
    const [medicines, setMedicines] = useState([{ id: '', dosage: 1 }]);
    const [medicines1, setMedicines1] = useState([]);
    const [instructions, setInstructions] = useState('');
    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: 1 }]);
    };
    const updateMedicine = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };
    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/getMedicines`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    console.log("P", response.data)
                    setMedicines1(response.data);
                }
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };
        fetchPrescriptions();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:4000/addPrescription', {
          medicines,
          instructions,
          doctor: usernameDoctor,
          patient: username
        })
        .then(response => {
            setMedicines([{ id: '', dosage: 1 }]);
            setInstructions('');
        })
        .catch(error => {
          console.error('Error adding prescription', error);
        });
      };


    return (
        <form onSubmit={handleSubmit}>


            <div className="form-container">
                <h2>New Prescription</h2>
                <p>Choose Medicine Name From our collections of medicines</p>
                {medicines.map((medicine, index) => (
                    <div key={index}>
                        <div className="form-group">
                            <label htmlFor={`medicine-${index}`}>Medicine:</label>
                            <select
                                id={`medicine-${index}`}
                                name={`medicine-${index}`}
                                value={medicine.id}
                                onChange={(e) => updateMedicine(index, 'id', e.target.value)}
                            >
                                {medicines1.map((medicine, index) => (
                                    <option key={index} value={medicine._id}>{medicine.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor={`dosage-${index}`}>Dosage:</label>
                            <input
                                type="number"
                                id={`dosage-${index}`}
                                name={`dosage-${index}`}
                                min="1"
                                value={medicine.dosage}
                                onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addMedicine}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions:</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </div>
        </form>
    );
}

export default PrescriptionForm;