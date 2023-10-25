import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/Stripe';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('your-publishable-key');

function HealthPackageSubscriptionPage() {
  const [healthPackages, setHealthPackages] = useState([]);
  const [formData, setFormData] = useState({
    selectedPackage: '', // Store the selected package ID
    paymentMethod: 'creditCard',
  });
  const [selectedPackageInfo, setSelectedPackageInfo] = useState(null); // Store the selected package details

  useEffect(() => {
    // Fetch available health packages from the backend when the component mounts
    async function fetchHealthPackages() {
      try {
        const response = await axios.get('http://localhost:4000/getPackages');
        if (response.status === 200) {
          setHealthPackages(response.data);
          if (response.data.length > 0) {
            // Set the selected package to the first one by default
            setFormData({ ...formData, selectedPackage: response.data[0]._id });
            setSelectedPackageInfo(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching health packages:', error);
      }
    }
    fetchHealthPackages();
  }, []);

  const handleSelectPackage = (selectedPackageId) => {
    const selectedPackage = healthPackages.find((pkg) => pkg.id === selectedPackageId);
    if (selectedPackage) {
      setFormData({ ...formData, selectedPackage: selectedPackage.id });
      setSelectedPackageInfo(selectedPackage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
  
    if (formData.paymentMethod === 'wallet') {
      try {
        const response = await axios.post('http://localhost:4000/payByWallet', formData);
        if (response.status === 200) {
          alert('Payment successful.');
          // You can navigate to the dashboard or another page
        }
      } catch (error) {
        console.error('Error processing wallet payment:', error);
        alert('An error occurred while processing the payment.');
      }
    }
  };

  return (
    <div>
      <h1>Health Package Subscription</h1>
      <div>
        <h2>Select a Health Package:</h2>
        <ul>
          {healthPackages.map((packagee) => (
            <li key={packagee.id}>
              <button
                onClick={() => handleSelectPackage(packagee.id)}
                style={{
                  backgroundColor:
                    formData.selectedPackage === packagee.id ? 'lightblue' : 'white',
                }}
              >
                <strong>{packagee.name}</strong>
                <br />
                Cost: ${packagee.cost}
                <br />
                Description: {packagee.description}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedPackageInfo && (
        <div>
          <h2>Selected Package Details:</h2>
          <p>
            <strong>Name:</strong> {selectedPackageInfo.name}
          </p>
          <p>
            <strong>Cost:</strong> ${selectedPackageInfo.cost}
          </p>
          <p>
            <strong>Description:</strong> {selectedPackageInfo.description}
          </p>
        </div>
      )}
      <form onSubmit={handleSubscribe}>
        <div>
          <label>Payment Method:</label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={formData.paymentMethod === 'creditCard'}
              onChange={handleChange}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="wallet"
              checked={formData.paymentMethod === 'wallet'}
              onChange={handleChange}
            />
            Wallet
          </label>
        </div>
        <button type="submit">Subscribe</button>
      </form>
      {formData.paymentMethod === 'creditCard' && (
 <div>
 <h2>Payment Information</h2>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
   <div style={{ flex: 1 }}>
     <Elements stripe={stripePromise}>
       <div className="stripe-container">
         <PaymentForm />
       </div>
     </Elements>
   </div>
   <div style={{ flex: 1 }}>
     {/* Add the Wallet form or content here */}
   </div>
 </div>
</div>
)}

    </div>
  );
}

export default HealthPackageSubscriptionPage;
