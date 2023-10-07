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

const getFamilyMembers = async (req, res) => {
  try {
    // Find the patient by their ID (you need to ensure proper authentication)
    const patient = await Patient.findById(req.user.id); // Assuming you have a user object with patient ID after authentication
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Access the patient's family members
    const familyMembers = patient.familyMembers;

    // Return the family members' data as JSON
    res.json(familyMembers);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






module.exports={createPatient,getPatients,getFamilyMembers}