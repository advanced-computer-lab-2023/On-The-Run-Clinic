
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PatientModel=require('./DoctorModel')

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
  
  myDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]
 
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