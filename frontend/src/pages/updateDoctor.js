import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

const UpdateDoctorInfo = () => {
  const { username } = useParams(); // Get the username from the URL parameter

  const [doctor, setDoctor] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    // Fetch the doctor's information based on the username from the URL
    axios.get(`http://localhost:4000/getDoctor?username=${username}`)
      .then((response) => {
        console.log(response);
        setDoctor(response.data);
      })
      .catch((error) => {
        console.error('Error fetching doctor information:', error);
      });
  }, [username]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Send a put request to update the doctor with username
      const response = await axios.put(`http://localhost:4000/updateDoctor?username=${username}`, values);

      if (response.status === 200) {
        console.log('Doctor information updated successfully:', response.data);
        setSuccessMessage('Doctor information updated successfully');
      }

      setSubmitting(false);
    } catch (error) {
      console.error('Error updating doctor information:', error);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Update Doctor Information</h2>
      {doctor && (
        <Formik
          initialValues={{
            email: doctor.email || '', // Initialize with the existing data
            hourly_rate: doctor.hourly_rate || 0, // Initialize with the existing data
            Affiliation: doctor.Affiliation || '', // Initialize with the existing data
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />

              <label htmlFor="hourly_rate">Hourly Rate</label>
              <Field type="number" id="hourly_rate" name="hourly_rate" />

              <label htmlFor="Affiliation">Affiliation</label>
              <Field type="text" id="Affiliation" name="Affiliation" />

              <button type="submit" disabled={isSubmitting}>
                Update Info
              </button>
              {successMessage && <p>{successMessage}</p>}
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default UpdateDoctorInfo;
