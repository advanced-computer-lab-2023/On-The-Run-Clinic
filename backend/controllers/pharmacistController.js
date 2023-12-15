

//create a new user
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');

const Pharmacist = require('../models/PharmacistModel');




const getPharmacists = async (req, res) => {
  try {
    const pharmacists = await Pharmacist.find({}).sort({ createdAt: -1 });

    res.status(200).json(pharmacists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the Pharmacists' });
  }
};

module.exports = {getPharmacists };