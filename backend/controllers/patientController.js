const Patient = require('../models/PatientModel');
const Prescription=require('../models/perscriptionsModel')

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
        myDoctors:[],
        myfamilymembers:[],
        prescriptions:[]

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
const searchPatientsByName = async (req, res) => {
  try {
    const { name } = req.query;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patients = await Patient.find({ name: { $regex: new RegExp(name, 'i') } });

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found with the provided name.' });
    }

    res.status(200).json(patients);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getMyPrescriptions = async (req, res) => {
  try {
    const { username} = req.query;
   

    // Find the doctor by ID and populate the 'patients' field
    const patient = await Patient.find({username:username});
   

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    

    const pID = patient[0].prescriptions;
    
    const prescriptions = await Prescription.find({ _id: { $in: pID } });
    
    console.log(prescriptions)
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports={createPatient,getPatients,deletePatient,searchPatientsByName,getMyPrescriptions}