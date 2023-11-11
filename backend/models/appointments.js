const mongoose = require('mongoose');
const PatientModel=require('./PatientModel');
const DoctorModel=require('./DoctorModel');
const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
<<<<<<< HEAD
    required: false,
=======
    required: null,
>>>>>>> de4034a (ahmed)
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
<<<<<<< HEAD
    enum: ['Scheduled', 'Cancelled', 'Completed','Available'],
    default: 'Scheduled',
=======
    enum: ['Available','Scheduled', 'Cancelled', 'Completed'],
    default: 'Available',
>>>>>>> de4034a (ahmed)
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
