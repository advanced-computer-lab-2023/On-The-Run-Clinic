const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PendingdoctorSchema = new mongoose.Schema({
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
      type: String,
      required: true,
    },
    hourly_rate: {
      type: String,
      required: true,
    },
    Affiliation: {
      type: String,
      required: false,
    },
    speciality: {
      type: String,
      required: false,
     
    },
    educational_background: {
      type: String,
      required: true,
    }});

    PendingdoctorSchema.pre('save', function (next) {
        if (!this.isModified('password')) {
          return next();
        }
      
        const saltRounds = 10; // Salt rounds for bcrypt
        this.password = bcrypt.hashSync(this.password, saltRounds);
        next();
      });
      
      const PendingDoctor = mongoose.model('PendingDoctor', PendingdoctorSchema);
      
      module.exports = PendingDoctor;