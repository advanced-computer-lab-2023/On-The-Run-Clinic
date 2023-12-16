import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Col, Row, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const UploadHistory = () => {
    const { username } = useParams();
    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [message, setMessage] = useState('');
    async function fetchMedicalHistory() {
        try {
            const response = await axios.get(`http://localhost:4000/getMedicalHistory/${username}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                setMedicalHistory(response.data);
            }
        } catch (error) {
            console.error('Error fetching medical history:', error);
        }
    }
    useEffect(() => {


        fetchMedicalHistory();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const handleDelete = async (filename) => {
        try {
            const response = await axios.delete(`http://localhost:4000/deleteMedicalRecord/${username}/${filename}`, {
                withCredentials: true
            });
            const response1 = await axios.get(`http://localhost:4000/getMedicalHistory/${username}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                setMedicalHistory(response1.data);
            }
        } catch (error) {
            console.error('Error deleting medical record:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        console.log('Username:', username);
        console.log(formData);

        axios.post('http://localhost:4000/upload', formData)
            .then(res => {
                setMessage(res.data.message);
                fetchMedicalHistory();
                // Refresh the page
            })
            .catch(err => {
                console.log(err);
            });
    };
    return (
        <>
            {errors && errors.server && (
                <div className="alert alert-danger" role="alert" style={{ fontSize: '15px' }}>
                    {errors.server}
                </div>
            )}
            <h4 style={{ fontSize: '17px', fontWeight: '600', marginTop: '0px' }}>Medical History</h4>
            <Row>
                <Col xs={11}>
                    <form onSubmit={handleSubmit}>
                        <input type="file" onChange={handleFileChange} />
                        <button type="submit" style={{ backgroundColor: '#14967f', color: 'white', float: 'right' }}>Upload</button>
                    </form>
                </Col>
            </Row>
            <Row className=" mt-4">
                <Col xs={11}>
                    <ListGroup>
                        {medicalHistory.map((file, index) => (
                            <ListGroup.Item key={index}>
                                <a href={`http://localhost:4000/${file.path}`} target="_blank" rel="noopener noreferrer">{file.filename}</a>
                                <FontAwesomeIcon icon={faTrash} style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(file.filename)} className="float-right" />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </>
    );
};

export default UploadHistory;