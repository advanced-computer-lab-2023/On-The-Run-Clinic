// controllers/messagesController.js
const Message = require('../models/crossoverMessagesModel');
const Doctor = require('../models/DoctorModel');
const Pharmacist = require('../models/PharmacistModel');

const createCrossMessage = async (req, res) => {
  const { doctortUsername, pharmacistUsername } = req.body;

  try {
    // Check if a message object already exists
    const existingMessage = await Message.findOne({
      doctor: doctortUsername,
      pharmacist: pharmacistUsername,
    });

    if (!existingMessage) {
      // Create a new message object if none exists
      const newMessage = new Message({
        doctor: doctortUsername,
        pharmacist: pharmacistUsername,
      });

      await newMessage.save();

      // Link the new message with patient and pharmacist
      await Doctor.findOneAndUpdate(
        { username: doctortUsername },
        { $push: { messages: newMessage._id } },
        { new: true }
      );
      await Pharmacist.findOneAndUpdate(
        { username: pharmacistUsername },
        { $push: { messages: newMessage._id } },
        { new: true }
      );
    }

    // Redirect the pharmacist to the chat page
    res.redirect(`/chat/${doctortUsername}/${pharmacistUsername}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the message object' });
  }
};

const getCrossChatMessages = async (req, res) => {
  const { username, doctor } = req.params;

  try {
    // Fetch messages based on sender and receiver
    const msgs = await Message.find({
      $or: [
        { doctor: username, pharmacist: doctor },
        { doctor: doctor, pharmacist: username },
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

const sendCrossMessageAsDoctor= async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    // Find or create the existing message
    let existingMessage = await Message.findOne({
      $or: [
        { pharmacist: sender, doctor: receiver },
        { pharmacist: receiver, doctor: sender },
      ],
    });

    if (!existingMessage) {
      // Create a new message object if none exists
      console.log(receiver) 
      existingMessage = new Message({
        doctor: sender,
        pharmacist: receiver,
      });
      console.log(existingMessage.doctor)
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

module.exports = { createCrossMessage, getCrossChatMessages, sendCrossMessageAsDoctor };
