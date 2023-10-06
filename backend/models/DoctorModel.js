const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PatientModel=require('./PatientModel')

const doctorSchema = new mongoose.Schema({
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
    required: false,
  },
  hourly_rate: {
    type: Number,
    required: false,
  },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
 
});

// Hash the password before saving to the database
doctorSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10; // Salt rounds for bcrypt
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;