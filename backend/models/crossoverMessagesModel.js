const mongoose = require('mongoose');
const Doctor = require('../models/DoctorModel');

const messageSchema = new mongoose.Schema({
  doctor: {
    type: String,
    ref: 'Doctor',
  },
  pharmacist: {
    type: String,
    ref: 'Pharmacist',
  },
  messages: [
    {
      sender: String, // 'doctor' or 'pharmacist'
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Message = mongoose.model('MessageCross', messageSchema);

module.exports = Message;
