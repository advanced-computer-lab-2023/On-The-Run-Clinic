// #Task route solution
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const Admin = require('../models/AdmiModel');
const { default: mongoose } = require('mongoose');
const express = require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username,role) => {
    return jwt.sign({ user:username,role }, 'supersecret', {
        expiresIn: maxAge
    });
};


const login = async (req, res) => {
  const { username, password } = req.body;
  try {
      let user = await Patient.findOne({ username });
      let role="patient"
      if(!user){
          user = await Doctor.findOne({ username });
          role="doctor"
      }
      if(!user){
          user = await Admin.findOne({ username });
          role="admin"
      }
      if(!user){
          return res.status(404).json({ error: 'User not found' });
      }

      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
          const token = createToken(user.username,role);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: false });
          return res.status(200).json({ user: user.username, role: role });
      } else {
          return res.status(401).json({ error: 'Incorrect password' });
      }
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
}

const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'User logged out' });
}







module.exports = { logout, login };
