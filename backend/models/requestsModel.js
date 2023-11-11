const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
  speciality: {
    type: String,
    required: false, // Set to true if affiliation is required
  },
  educational_background: {
    type: String,
    required: true, // Set to true if educational background is required
  },
  status1: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    required: false,
  },
  reqDocs: [{
    data: Buffer,
    mimetype: String,
    name: String,
  }],
  Affiliation:{
    type:String,
    required:false
  }
  
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;




