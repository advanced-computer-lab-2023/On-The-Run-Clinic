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
      hourly_rate
    } = req.body;

    // Create a new doctor record
    const newDoctor = new Doctor({
      username,
      name,
      email,
      password, // Hash the password before saving (use a library like bcrypt)
      date_of_birth,
      hourly_rate,
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
    const { username, searchName } = req.query;
   

    // Find the doctor by ID and populate the 'patients' field
    const doctor = await Doctor.find({username:username});
   

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    

    const patientsID = doctor[0].patients;
    
    const patients = await Patient.find({ _id: { $in: patientsID } });
    let filteredPatients = patients;
    if (searchName) {
      filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    console.log(patients)
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
    await Doctor.findOneAndDelete(username);

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor' });
  }
};
const updateDoctor = async (req, res) => {
  //update a doctor in the database

  const {username, Email,Hourly_Rate, Affiliation} = req.body
  try {
   
 const filter = { username: username };
 const update = { $set: { email: Email, hourly_Rate: Hourly_Rate, Afiliation: Affiliation } };

 const result = await DoctorModel.updateOne(filter, update);
 console.log(result);
     res.status(200).json(user)
  } catch (error) {
     res.status(500).json({error: error.message})
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

module.exports={createDoctor,getDocPatients,getDoctors,deleteDoctor,updateDoctor,addPatientToDr}