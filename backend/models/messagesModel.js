const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  patient: {
    type: String,
    ref: 'Patient',
  },
  pharmacist: {
    type: String,
    ref: 'Doctor',
  },
  messages: [
    {
      sender: String, // 'patient' or 'pharmacist'
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
