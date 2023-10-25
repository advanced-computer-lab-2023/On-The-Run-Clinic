import React, { useEffect } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import './Stripe.css';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Perform any initialization or setup here.
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle form submission (not necessary for your use case).
    // You can display a success message or alert here.

    // Clear the form.
    elements.getElement(CardElement).clear();
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <label className="form-group">
        Card Details:
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px', // Adjust the font size
              },
            },
          }}
          className="card-element"
        />
      </label>
      <button type="submit" className="submit-button">
        Pay
      </button>
    </form>
  );
}

export default PaymentForm;
