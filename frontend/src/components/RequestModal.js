

import { Document, Page } from 'react-pdf';

import React, { useState, useEffect } from 'react';



const RequestModal = ({ setOpenModal, request }) => {
    const [numPages, setNumPages] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
   
      
     

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
                    <h1>Request</h1>
                </div>
                <div className="metadata">
                    <table style={{ fontSize: '16px' }}>
                        <tbody>
                            <tr><td><strong>Request ID:</strong></td><td>{request._id}</td></tr>
                            <tr><td><strong>Username:</strong></td><td>{request.username}</td></tr>
                            <tr><td><strong>Name:</strong></td><td>{request.name}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>{request.email}</td></tr>
                            <tr><td><strong>Date of Birth:</strong></td><td>{request.date_of_birth} $</td></tr>
                            <tr><td><strong>Hourly Rate:</strong></td><td>{request.hourly_rate}</td></tr>
                            <tr><td><strong>Affiliation:</strong></td><td>{request.Affiliation}</td></tr>
                            <tr><td><strong>status:</strong></td><td>{request.status1}</td></tr>
                        </tbody>
                    </table>
                   
                </div>
            </div>
        </div>
    );
};

export default RequestModal;
