const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  medicationName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Reference to the patient who owns this prescription
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  filled: {
    type: Boolean,
    default: false, // Set the default value to false
  },
  
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;