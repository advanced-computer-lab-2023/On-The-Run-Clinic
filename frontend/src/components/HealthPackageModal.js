import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'


const PackageDetailsModal = ({ setOpenModal, packagee,onSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(packagee.name);
    const [editedPrice, setEditedPrice] = useState(packagee.price);
    const [editedServices, setEditedServices] = useState(packagee.services);
    const [updatedPackage, setUpdatedPackage] = useState({
        name: packagee.name,
        price: packagee.price,
        services: packagee.services,
      });
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = () => {
        // Send a PUT request to update the selected package
        axios.put(`http://localhost:4000/updatePackage?id=${packagee._id}`, updatedPackage,{
          withCredentials: true
        })
          .then((response) => {
            console.log('Package updated successfully:', response.data);
            // Reset the selected package and updated package state
        
            onSuccess(true);
            packagee.price=updatedPackage.price;
            packagee.name=updatedPackage.name;
            packagee.services=updatedPackage.services;
            setIsEditing(false);
          }
          )
      };
    
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                
                <div className="titleCloseBtn">
                <FontAwesomeIcon icon={faEdit} onClick={handleEdit} style={{ cursor: 'pointer' }} />
                    <button
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        X
                    </button>
                    
                </div>
                <div className='title'>
                    <h1 style={{ color: '#14967f' }}>Health Package Details</h1>
                </div>
                <div className="metadata">
                    <table style={{ fontSize: '20px',marginTop:'50px' }}>
                        <tbody>
                            {isEditing ? (
                                <>
                                    <tr>
                                        <td><strong>Name:</strong></td>
                                        <td><input type="text" defaultValue={packagee.name} onChange={e => setUpdatedPackage({ ...updatedPackage, name: e.target.value })} /></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Price:</strong></td>
                                        <td><input type="text" defaultValue={packagee.price} onChange={e => setUpdatedPackage({ ...updatedPackage, price: e.target.value })} /></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Services:</strong></td>
                                        <td><input type="text" defaultValue={packagee.services} onChange={e => setUpdatedPackage({ ...updatedPackage, services: e.target.value })} /></td>
                                    </tr>
                                  <div stytle={{display: 'flex', justifyContent: 'center'}}>
                                  <button style={{marginTop:'50px',marginLeft:'170px'}} onClick={handleSubmit}>Save</button>
                                  </div>
                                      
                                   
                                </>
                            ) : (
                                <>
                                    <tr><td><strong>ID:</strong></td><td>{packagee._id}</td></tr>
                                    <tr><td><strong>Name:</strong></td><td>{packagee.name}</td></tr>
                                    <tr><td><strong>Price:</strong></td><td>${packagee.price}</td></tr>
                                    <tr><td><strong>Services:</strong></td><td>{packagee.services} </td></tr>
                                    
                                </>
                            )}</tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default PackageDetailsModal;
