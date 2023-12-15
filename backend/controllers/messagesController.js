// controllers/messagesController.js
const Message = require('../models/messagesModel');
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');

const createMessage = async (req, res) => {
  const { patientUsername, pharmacistUsername } = req.body;

  try {
    // Check if a message object already exists
    const existingMessage = await Message.findOne({
      patient: patientUsername,
      pharmacist: pharmacistUsername,
    });

    if (!existingMessage) {
      // Create a new message object if none exists
      const newMessage = new Message({
        patient: patientUsername,
        pharmacist: pharmacistUsername,
      });

      await newMessage.save();

      // Link the new message with patient and pharmacist
      await Patient.findOneAndUpdate(
        { username: patientUsername },
        { $push: { messages: newMessage._id } },
        { new: true }
      );
      await Doctor.findOneAndUpdate(
        { username: pharmacistUsername },
        { $push: { messages: newMessage._id } },
        { new: true }
      );
    }

    // Redirect the patient to the chat page
    res.redirect(`/chat/${patientUsername}/${pharmacistUsername}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the message object' });
  }
};

const getChatMessages = async (req, res) => {
  const { username, doctor } = req.params;

  try {
    // Fetch messages based on sender and receiver
    const msgs = await Message.find({
      $or: [
        { patient: username, pharmacist: doctor },
        { patient: doctor, pharmacist: username },
      ],
    }).sort({ timestamp: 1 });
    console.log(msgs.map((message) => message.messages));

    const formattedMessages = msgs.map((message) => ({
      messages: message.messages.map((msg) => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    }));
    
    console.log(formattedMessages) ; 
    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const sendMessageAsPatient = async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    // Find or create the existing message
    let existingMessage = await Message.findOne({
      $or: [
        { patient: sender, pharmacist: receiver },
        { patient: receiver, pharmacist: sender },
      ],
    });

    if (!existingMessage) {
      // Create a new message object if none exists
      existingMessage = new Message({
        patient: sender,
        pharmacist: receiver,
      });
    }

    // Update the existing message by pushing the new message details
    existingMessage.messages.push({
      sender: 'patient',
      content: message,
      timestamp: Date.now(),
    });

    // Save the updated message
    await existingMessage.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const sendMessageAsDoctor = async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    // Find or create the existing message
    let existingMessage = await Message.findOne({
      $or: [
        { pharmacist: sender, patient: receiver },
        { pharmacist: receiver, patient: sender },
      ],
    });

    if (!existingMessage) {
      // Create a new message object if none exists
      existingMessage = new Message({
        pharmacist: sender,
        patient: receiver,
      });
    }

    // Update the existing message by pushing the new message details
    existingMessage.messages.push({
      sender: 'doctor',
      content: message,
      timestamp: Date.now(),
    });

    // Save the updated message
    await existingMessage.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createMessage, getChatMessages, sendMessageAsPatient, sendMessageAsDoctor };
