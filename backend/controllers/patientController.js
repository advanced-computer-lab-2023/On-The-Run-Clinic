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
const getPatient=async(req,res)=>{
  try {
    // Get the patient ID from the URL parameters
    const { id } = req.params;

    // Fetch the patient from the database using the ID
    const patient = await Patient.findById(id);

    if (!patient) {
      // If no patient is found with the given ID, return a 404 status
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return the patient data as JSON response
    res.status(200).json(patient)
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const getPatients=async(req,res) =>{
  const users =await Patient.find({}).sort({createdAt:-1});
     // for(let index=0;index<users.length;index++){
       //  const element = users[index];
        // console.log(element.id);
      //}
      res.status(200).json(users)
}
// Delete Patient Controller
const deletePatient = async(req,res) => {
  try {
    // Extract the doctor ID from the request parameters
    const { id } = req.params;

    // Find the doctor by ID and delete them from the database
    const deletedUser = await Patient.findByIdAndDelete({ _id:id });

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor' });
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
const searchPatientsByUSername = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patient = await Patient.findOne({ usernaem: username });

    

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getMyPrescriptions = async (req, res) => {
  try {
    const { username} = req.params;
   

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
const searchPatientsByUserame = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patients = await Patient.findOne({ username:username });

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found with the provided name.' });
    }

    res.status(200).json(patients);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports={createPatient,getPatients,deletePatient,searchPatientsByName,getMyPrescriptions,searchPatientsByUserame,getPatient,searchPatientsByUSername}
