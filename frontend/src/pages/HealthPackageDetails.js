import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
        const response = await axios.get(`http://localhost:4000/mypackage/${username}`);
        const pat = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`);
        if (response.status === 200) {
          setPackage(response.data.healthPackage); // Assuming the response contains the health package or null if not found
          console.log(response.data);
        }
        if(pat.status===200) {
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
      const response =await axios.post(`http://localhost:4000/CancelPackage/${username}`);
      // You may want to refresh the status after cancelling
      if(response.status===(4000)){
        alert("No Subscription Found");
      }
      else{
      setStatus(`Cancelled (Package Cancelled Date: `+ new Date()+')');
      alert('Health Package Subscription Cancelled');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  return (
    <div>
      <h1>Health Package Of {username}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : hPackage ? (
        <div>
          <p>Name: {hPackage.name}</p>
          <p>Price: {hPackage.price}</p>
          <p>Discount: {hPackage.discount}</p>
          <p>Services: {hPackage.services}</p>
          <p>Status: {status}</p>
            <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <p>No Health Packages Found.</p>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default HealthPackageList;
