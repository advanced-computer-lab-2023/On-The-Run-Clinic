import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Card } from 'react-bootstrap';

function HealthPackageList() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [hPackage, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Patient, setPatient] = useState(null);

  const [status, setStatus] = useState('');
  
  
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/mypackage/${username}`, {
          withCredentials: true
        });
        const pat = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setPackage(response.data.healthPackage); // Assuming the response contains the health package or null if not found
          console.log(response.data);
        }
        if (pat.status === 200) {
          setPatient(pat.data);
          calculateStatus(pat.data);
        }
      } catch (error) {
        console.error('Error fetching Health Packages:', error);
      } finally {
        setLoading(false);
      }
    };

    const calculateStatus = (patientData) => {
      const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds
      const currentDate = new Date().getTime();
      const packageBoughtDate = new Date(patientData.packageBoughtDate).getTime();
      const packageCancelledDate = patientData.packageCancelledDate
        ? new Date(patientData.packageCancelledDate).getTime()
        : null;

      if (packageCancelledDate) {
        setStatus(`Cancelled (Package Cancellation Date: ${patientData.packageCancelledDate})`);
      } else if (packageBoughtDate + sixMonths >= currentDate) {
        const renewalDate = new Date(packageBoughtDate + sixMonths);
        setStatus(`Subscribed (Renewal Date: ${renewalDate.toDateString()})`);
      } else {
        setStatus('Unsubscribed');
      }
    };

    fetchPackage();
  }, [username]);

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/CancelPackage/${username}`, {}, {
        withCredentials: true
      });
      // You may want to refresh the status after cancelling
      if (response.status === (400)) {
        alert("No Subscription Found");
      }
      else {
        setStatus(`Cancelled (Package Cancelled Date: ` + new Date() + ')');
        alert('Health Package Subscription Cancelled');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };
  

  return (
    <div>
    <Container>
      <Row >
        <Col md="auto">
        <h2 className="my-4 text-center">My health Package</h2>

          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : hPackage ? (
            <>
              
              <Card style={{ width: '18rem', marginBottom: '1rem' }}>
                <Card.Header as="h5">{hPackage.name}</Card.Header>
                <Card.Body>
                  <Card.Text>Price: {hPackage.price}</Card.Text>
                  <Card.Text>Discount: {hPackage.discount}</Card.Text>
                  <Card.Text>Services: {hPackage.services}</Card.Text>
                  <Card.Text>Status: {status}</Card.Text>
                  <Button variant="danger" onClick={handleCancelSubscription}>Cancel Subscription</Button>
                </Card.Body>
              </Card>
              
              
            </>
          ) : (
            <p>No Health Packages Found.</p>
          )}
          <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>
        </Col>
      </Row>
    </Container>
    <Container>
      
    </Container>
    </div>
  );
}

export default HealthPackageList;