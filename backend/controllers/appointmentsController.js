// Import necessary modules and models
const express = require('express');
const Appointment = require('../models/appointments');
const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel'); // Import your Patient model


const createAppointment = async(req,res) => {
    try {
        const { username } = req.query;
        const { patientId, doctorId, date, status, description } = req.body;
        const appointment = new Appointment({ patientId, doctorId, date, status, description });
        await appointment.save();
        const doctor = await Doctor.findById(doctorId);
        const doctorUsername = doctor.username;
        const patient = await Patient.findById(patientId);
        const patientUsername = patient.username;

        if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
        }
       
        if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
        }

        

       if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        if (!patient.myDoctors || !Array.isArray(patient.myDoctors)) {
          patient.myDoctors = [];
        }
    
        

        res.status(201).json({ message: 'Appointment created successfully', appointment });
      } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'An error occurred while creating the appointment' });
      }
};

/*const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, status, description } = req.body;
    const appointment = new Appointment({ patientId, doctorId, date, status, description });
    await appointment.save();
    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
};*/
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching appointments' });
      }
};
const filter=async(req,res) =>{
    try {
        const { date, status } = req.query;
        const filters = {};
        
        if (date) {
          filters.date = new Date(date);
        }
    
        if (status) {
          filters.status = status;
        }
    
        const filteredAppointments = await Appointment.find(filters);
        res.status(200).json(filteredAppointments);
      } catch (error) {
        console.error('Error filtering appointments:', error);
        res.status(500).json({ error: 'An error occurred while filtering appointments' });
      }
}


module.exports={createAppointment,getAllAppointments,filter}