import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';

// const Doctor = () => {
//   const [doctor, setDoctor] = useState([]);

//   useEffect(() => {
//     // Make an API request to fetch doctors' data
//     axios.get('http://localhost:4000/getDoctor/${username}')
//       .then((response) => {
//         // Set the fetched data in the state
//         setDoctor(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching doctor:', error);
//       });
//   }, []); // Empty dependency array to run the effect only once

//   return (
//     <div>
//       <h2>My Information</h2>
//       <ul>
//         {doctor.map((member) => (
//           <li key={member._id}>
//             <p>Username: {member.username}</p>
//             <p>Name: {member.name}</p>
//             <p>Email: {member.email}</p>
//             <p>Password: {member.password}</p>
//             <p>Date of Birth: {member.date_of_birth}</p>
//             <p>Hourly Rate: {member.hourly_rate}</p>
//             <p>Affiliation: {member.Affiliation}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

const UpdateDoctorInfo = ({ onRegistrationSuccess }) => {
    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        // Send a put request to update the doctor
        const response = await axios.put('/updateDoctor', values);
  
        // Assuming the response contains the doctor's ID upon successful registration
        const doctorId = response.data.doctorId;
  
        // Call a callback function to handle registration success
        onRegistrationSuccess(doctorId);
      } catch (error) {
        console.error('Error registering doctor:', error);
      }
    };
  
    return (
      <Formik
        initialValues={{
          email: '',
          hourly_rate: 0,
          Affiliation: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />
  
            <label htmlFor="hourly_rate">Hourly Rate</label>
            <Field type="number" id="hourly_rate" name="hourly_rate" />

            <label htmlFor="Affliation">Password</label>
            <Field type="text" id="Affiliation" name="Affiliation" />
  
            <button type="submit" disabled={isSubmitting}>
              Change Info
            </button>
          </Form>
        )}
      </Formik>
    );
  };
  
export default UpdateDoctorInfo;
