
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const DoctorModel=require('./DoctorModel')
const HealthPackageModel = require('./HealthPackages');

const PatientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  emergencyContact: {
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    healthpackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthPackage',
      required: false
    }

    
  },
  
  myDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  myfamilymembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMem' }],
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  }],
 
});

// Hash the password before saving to the database
PatientSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10; // Salt rounds for bcrypt
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;