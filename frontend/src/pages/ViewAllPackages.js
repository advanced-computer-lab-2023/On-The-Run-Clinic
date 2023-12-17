import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import { Card, ListGroup, Button, Col, Container, Row, Spinner, Modal, Form } from 'react-bootstrap';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/Stripe';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('your-publishable-key');

const AllPackages = () => {
  const { username } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [hPackage, setPackage] = useState('');
  const [status, setStatus] = useState('');
  const [patient, setPatient] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    selectedPackage: '', // Store the selected package ID
    paymentMethod: 'creditCard',
    username: username,
    LinkedPatientId: null,
  });

  useEffect(() => {
    async function fetchHealthPackages() {

      try {
        const response = await axios.get('http://localhost:4000/getPackages', {
          withCredentials: true
        });
        if (response.status === 200) {
          setPackages(response.data);
        }
      } catch (error) {
        console.error('Error fetching health packages:', error);
      }

    }

    fetchHealthPackages();
  }, [username]);
  const handleSubscribe = (packageId) => {
    setPackage(packageId);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true)
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





  const handleConfirmSubscribe = async (e) => {
    e.preventDefault();
    console.log(formData)
    formData.selectedPackage=hPackage;
  
      try {
        console.log(formData)
        const response = await axios.post('http://localhost:4000/payPackage', formData, {
          withCredentials: true
        });
        const response1 = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
          withCredentials: true
        });
        if (response1.status === 200) {
          setPatient(response1.data);
          console.log("patient:", patient);

        }
        if (response.status === 200) {

          setShowModal(false);
          // You can navigate to the dashboard or another page
        }

      } catch (error) {
        console.error('Error processing wallet payment:', error);
        alert('An error occurred while processing the payment.');
      }
    



  };
  const handleSelectPaymentMethod = (e) => {
    setFormData({
      ...formData,
      paymentMethod: e.target.value
    });
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ marginLeft: '30px' }}>
        <Container>
          <Row >
            <Col md="auto">
              <h2 className="my-4 text-center">{patient.name} health Package</h2>

              {loading ? (
                <div className="spinner-container">
                  <BeatLoader color="#14967f" size={15} />
                </div>
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

            </Col>
          </Row>
        </Container>

      </div>
      <div className="container">
        <div className="patients-list">
          <h2 className="my-4 text-center">Health Packages</h2>
          {loading ? (
            <div className="spinner-container">
              <BeatLoader color="#14967f" size={15} />
            </div>
          ) : packages.length === 0 ? (
            <p>No Packages found</p>
          ) : (
            <Row>
              {packages.map((p) => (
                <Col md={4}>
                  <Card className="mb-4 shadow-sm">
                    <Card.Header as="h5" >{p.name}</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Cost:</strong> ${p.price}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Services:</strong> {p.services}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Discount:</strong> {p.discount}
                      </ListGroup.Item>
                    </ListGroup>
                    <Card.Footer>
                      <Button variant="primary" block onClick={() => handleSubscribe(p)}>Subscribe</Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Subscribe to Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="paymentMethod" className="mb-3">
              <div>
                <Form.Label>My Wallet: ${patient.wallet}</Form.Label>
              </div>
              <div>
                <Form.Label>Cost: ${hPackage.price}</Form.Label>
              </div>
              <div>
                <Form.Label>Payment Method</Form.Label>
              </div>
              <Form.Control as="select" custom onChange={handleSelectPaymentMethod}>
                <option value="creditCard">Credit Card</option>
                <option value="wallet">Wallet</option>
              </Form.Control>
            </Form.Group>
            {formData.paymentMethod === 'creditCard' && (
              <Elements stripe={stripePromise}>
                <PaymentForm />
              </Elements>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmSubscribe}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
};

export default AllPackages;