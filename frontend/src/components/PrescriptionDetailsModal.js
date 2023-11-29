// PrescriptionDetailsModal.jsx
import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// Set the root element for accessibility

const PrescriptionDetailsModal = ({ setOpenModal, prescription }) => {

    return (

        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        X
                    </button>
                </div>
                <div className='title'>
                    <h1>Prescription</h1>
                </div>
                <div className="metadata">
                    <p><strong>ID: </strong>{prescription._id}</p>
                    <p><strong>Date: </strong>{prescription.date}</p>
                    <p><strong>Doctor ID: </strong>{prescription.doctor}</p>
                    <p><strong>Filled: </strong>{prescription.status === 'filled' ? 'Yes' : 'No'}</p>
                </div>
                <div className="medicine-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Medicine Name</th>
                                    <th>Dosage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescription.medicines.map((medicine, index) => (
                                    <tr key={index}>
                                        <td>{medicine.medicineName}</td>
                                        <td>{medicine.dosage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                <div className="metadata">
                    
                    <p><strong>Instructions: </strong>{prescription.instructions}</p>
                    
                </div>

            </div>
        </div>
    );
};

export default PrescriptionDetailsModal;
