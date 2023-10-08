// Import necessary modules and models
const express = require('express');

const Doctor = require('../models/DoctorModel'); // Import your Doctor model
const Patient = require('../models/PatientModel');

// Register Doctor Controller
const createDoctor = async(req,res) => {
  try {
    // Extract data from the request body
    const {
      username,
      name,
      email,
      password,
      date_of_birth,
      hourly_rate,
      Affiliation,
      speciality,
      educational_background
    } = req.body;

    // Create a new doctor record
    const newDoctor = new Doctor({
      username,
      name,
      email,
      password, // Hash the password before saving (use a library like bcrypt)
      date_of_birth,
      hourly_rate,
      Affiliation,
      speciality,
      educational_background,
      patients:[]
    });

    // Save the new doctor to the database
    await newDoctor.save();

    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the doctor' });
  }
};
const getDocPatients = async (req, res) => {
  try {
    const { username } = req.query;

    // Find the doctor by ID and populate the 'patients' field
    const doctor = await Doctor.find({username:username}).populate('patients');
   

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const patients = doctor[0].patients;
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getDoctors=async(req,res) =>{
  const users =await Doctor.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
        console.log(element.id);
      }
      res.status(200).json(users)
}
// Delete Doctor Controller
const deleteDoctor = async(req,res) => {
  try {
    // Extract the doctor ID from the request parameters
    const { username } = req.body;

    // Find the doctor by ID and delete them from the database
    await Doctor.findOneAndDelete( {username: username });

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor' });
  }
};
const updateDoctor = async (req, res) => {
  const { username } = req.query; // Get the username from the URL parameter
  const { email, Affiliation, hourly_rate } = req.body; // Get the updated data from the request body

  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({ username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update the doctor's email, affiliation, or hourly rate if provided
    if (email) {
      doctor.email = email;
    }

    if (Affiliation) {
      doctor.Affiliation = Affiliation;
    }

    if (hourly_rate) {
      doctor.hourly_rate = hourly_rate;
    }

    // Save the updated doctor
    await doctor.save();

    res.status(200).json({ message: 'Doctor information updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 };
 const getDoctorByUsername = async (req, res) => {
  const { username } = req.query; // Get the username from the URL parameter

  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({ username:username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 const addPatientToDr =async(req,res)=>{
  try {
    const { doctorId, patientId } = req.body;

    // Check if the doctor and patient IDs are provided
    if (!doctorId || !patientId) {
      return res.status(400).json({ message: 'Doctor ID and Patient ID are required.' });
    }

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);

    // Check if the doctor exists
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Find the patient by ID
    const patient = await Patient.findById(patientId);

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Add the patient to the doctor's patients list
    doctor.patients.push(patient);

    // Save the updated doctor document
    await doctor.save();

    res.status(201).json({ message: 'Patient added to the doctor successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the patient to the doctor.' });
  }
}
 


// Implement other controllers (e.g., update profile, view profile, list patients, etc.) following a similar structure

module.exports={createDoctor,getDocPatients,getDoctors,deleteDoctor,updateDoctor,addPatientToDr,getDoctorByUsername}