// models/messagesModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  patient: {
    type: String,
    ref: 'Patient',
  },
  doctor: {
    type: String,
    ref: 'Doctor',
  },
  patientMessages: [
    {
      sender: String, // 'patient'
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  doctorMessages: [
    {
      sender: String, // 'doctor'
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
