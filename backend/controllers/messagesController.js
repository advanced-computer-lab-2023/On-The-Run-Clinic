// controllers/messagesController.js
const Message = require('../models/messagesModel');
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');

const createMessage = async (req, res) => {
  const { patientUsername, doctorUsername } = req.body;

  try {
    // Check if a message object already exists
    const existingMessage = await Message.findOne({
      patient: patientUsername, // Assuming user is authenticated and the patient's ID is in req.user._id
      doctor: doctorUsername, // Replace this with the doctor's ID or username
    });
    if (!existingMessage) {
      // Create a new message object if none exists
      const newMessage = new Message({
        patient: patientUsername,
        doctor: doctorUsername, // Replace this with the doctor's ID or username
      });

      await newMessage.save();
      
      // Link the new message with patient and doctor
      await Patient.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { messages: newMessage._id } },
        { new: true }
      );
      await Doctor.findOneAndUpdate(
        { username: doctorUsername }, // Replace this with the doctor's ID or username
        { $push: { messages: newMessage._id } },
        { new: true }
      );
    }

    // Redirect the patient to the chat page
    res.redirect(`/chat/${patientUsername}/${doctorUsername}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the message object' });
  }
};

const getChatMessages = async (req, res) => {
  const { username, doctor } = req.params;

  try {
    // Fetch messages based on sender and receiver
    const messages = await Message.find({
      $or: [
        { patient: username, pharmacist: doctor },
        { patient: doctor, pharmacist: username },
      ],
    }).sort({ createdAt: 1 });
    // Extract only the necessary fields from patientMessages and pharmacistMessages
    const formattedMessages = messages.map((message) => ({
      patientMessages: message.patientMessages.map((patientMsg) => ({
        sender: patientMsg.sender,
        content: patientMsg.content,
      })),
      pharmacistMessages: message.pharmacistMessages.map((pharmacistMsg) => ({
        sender: pharmacistMsg.sender,
        content: pharmacistMsg.content,
      })),
    }));

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
        { sender, receiver },
        { patient: sender, doctor: receiver },
      ],
    });

    if (!existingMessage) {
      // Create a new message object if none exists
      existingMessage = new Message({
        patient: sender,
        doctor: receiver,
      });

      await existingMessage.save();

      // Link the new message with patient and doctor
      await Patient.findOneAndUpdate(
        { username: sender },
        { $push: { messages: existingMessage._id } },
        { new: true }
      );
      await Doctor.findOneAndUpdate(
        { username: receiver },
        { $push: { messages: existingMessage._id } },
        { new: true }
      );
    }

    // Update the existing message by pushing the new message details
    existingMessage.patientMessages.push({
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
        { sender, receiver },
        { doctor: sender, patient: receiver },
      ],
    });

    if (!existingMessage) {
      // Create a new message object if none exists
      existingMessage = new Message({
        doctor: sender,
        patient: receiver,
      });

      await existingMessage.save();

      // Link the new message with doctor and patient
      await Doctor.findOneAndUpdate(
        { username: sender },
        { $push: { messages: existingMessage._id } },
        { new: true }
      );
      await Patient.findOneAndUpdate(
        { username: receiver },
        { $push: { messages: existingMessage._id } },
        { new: true }
      );
    }

    // Update the existing message by pushing the new message details
    existingMessage.doctorMessages.push({
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
module.exports = { createMessage,getChatMessages,sendMessageAsPatient,sendMessageAsDoctor };
