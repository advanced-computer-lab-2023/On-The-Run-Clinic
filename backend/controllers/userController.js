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
        const user = await Patient.findOne({ username });
        let role="patient"
        if(!user){
            const user = await Doctor.findOne({ username });
            role="doctor"
        }
        if(!user){
            const user = await Admin.findOne({ username });
            role="admin"
        }
        if(!user){
            res.status(404).json({ error: 'User not found' });
        }
        if (user) {


            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = createToken(user.username,role);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: false });
                res.status(200).json({ user: user.username, role: role });
            } else {
                res.status(401).json({ error: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'User logged out' });
}







module.exports = { logout, login };
