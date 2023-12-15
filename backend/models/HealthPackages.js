const mongoose = require('mongoose');


const healthPackage = new mongoose.Schema({

  price: {
    type: Number,
    required: true,
  },
  services:
  {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
    unique: true
  }
  ,
  discount: {
    type: Number,
    required: false,
    default: 0.0
  }


});
const HealthPackage = mongoose.model('HealthPackage', healthPackage);

module.exports = HealthPackage;