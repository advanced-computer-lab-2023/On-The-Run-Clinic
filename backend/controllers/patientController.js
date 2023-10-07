const Patient = require('../models/PatientModel');

const { default: mongoose } = require('mongoose');

const createPatient = async(req,res) => {
   try{ const {
        username,
        password,
        name,
        email,
        date_of_birth,
        gender,
        mobileNumber,
        emergencyContact,
        
      } = req.body;
      const newPatient = new Patient({
        username,
        password,
        name,
        email,
        date_of_birth,
        gender,
        mobileNumber,
        emergencyContact,
        myDoctors:[]
      });
      await newPatient.save();

    res.status(201).json({ message: 'Patient registered successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the Patient' });
  }
}
const getPatients=async(req,res) =>{
  const users =await Patient.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
         console.log(element.id);
      }
      res.status(200).json(users)
}
// Delete Patient Controller
const deletePatient = async(req,res) => {
  try {
    // Extract the patient ID from the request parameters
    const { id } = req.params;

    // Find the patient by ID and delete them from the database
    await Patient.findByIdAndDelete(id);

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the patient' });
  }
};

module.exports={createPatient,getPatients,deletePatient}