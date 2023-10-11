const mongoose = require('mongoose');
const PatientModel=require('./PatientModel');
const DoctorModel=require('./DoctorModel');
const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to the Doctor model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Cancelled', 'Completed'],
    default: 'Scheduled',
  },
  description: {
    type: String,
    required: true,
  },
  hour:{
    type:Number,
    required:false
  }
  
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
