import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

const FamilyMemberForm = ({ onRegistrationSuccess }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Send a POST request to add family member
      const response = await axios.post('/addFamilyMember', values);

      // Assuming the response contains the family member's ID upon successful registration
      const memberId = response.data.memberId;

      // Call a callback function to handle registration success
      onRegistrationSuccess(memberId);
    } catch (error) {
      console.error('Error registering family member:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        national_id: '',
        age: '',
        gender: '',
        relation: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>

          <label htmlFor="name">Name</label>
          <Field type="text" id="name" name="name" />

          <label htmlFor="naional_id">National_ID</label>
          <Field type="text" id="naional_id" name="naional_id" />

          <label htmlFor="age">Age</label>
          <Field type="number" id="age" name="age" />

          <label htmlFor="gender">Gender </label>
          <Field type="checkbox" id="gender" name="gender" value= "Male" />
          <Field type="checkbox" id="gender" name="gender" value= "Female" />
          
          <label htmlFor="relation">Relation</label>
          <Field type="text" id="relation" name="relation" />

          <button type="submit" disabled={isSubmitting}>
            Add!
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FamilyMemberForm;