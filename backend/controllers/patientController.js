const Patient = require('../models/PatientModel');

const { default: mongoose } = require('mongoose');

const createPatient = async(req,res) => {
   try{ const {
        username,
        password,
        name,
        email,
        date_of_birth,
        
      } = req.body;
      const newPatient = new Patient({
        username,
        password,
        name,
        email,
        date_of_birth,
        myDoctors:[]
      });
      await newPatient.save();

    res.status(201).json({ message: 'Patient registered successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the Patient' });
  }
}
module.exports={createPatient}