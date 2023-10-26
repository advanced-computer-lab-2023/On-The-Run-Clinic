const Prescription=require('../models/perscriptionsModel')

const { default: mongoose } = require('mongoose');
const Doctor = require('../models/DoctorModel'); // Import your Doctor model
const Patient = require('../models/PatientModel');
const Admin = require('../models/AdmiModel');

const jwt = require('jsonwebtoken');
const HealthPackage = require('../models/HealthPackages');
const multer = require('multer');
const path = require('path');


const createToken=(_id)=>{
  jwt.sign({_id:_id},process.env.SECRET,{expiresIn:'3d'})
}

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
      const existingDoctor = await Doctor.findOne({ username });
    const existingPatient = await Patient.findOne({ username });
    const existingAdmin= await Admin.findOne({ username });
    if (existingDoctor||existingPatient||existingAdmin) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
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
      const token=createToken(newPatient._id)

    res.status(201).json({newPatient,token});

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
const linkMemberByEmail=async(req,res)=>{
  try {
    const { username,email,relation,mobileNumber } = req.body;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patient =await Patient.findOne({username:username});
   
    if(email){
      const patientToBeLinked = await Patient.findOne({ email:email });
      if (!patientToBeLinked||!patient) {
        return res.status(404).json({ message: 'No patients found with the provided email.' });
      }
      patient.linkedPatients.push({
        linkedPatientId: patientToBeLinked._id,
        linkedPatientRelation: relation,
        linkedPatientName:patientToBeLinked.name
      });
      await patient.save();

    }
    else if(email&&mobileNumber){
      const patientToBeLinked = await Patient.findOne({ mobileNumber:mobileNumber,email:email });
      if (!patientToBeLinked||!patient) {
        return res.status(404).json({ message: 'No patients found with the provided email.' });
      }
      patient.linkedPatients.push({
        linkedPatientId: patientToBeLinked._id,
        linkedPatientRelation: relation,
        linkedPatientName:patientToBeLinked.name
      });
      await patient.save();

    }
    else{
      const patientToBeLinked = await Patient.findOne({ mobileNumber:mobileNumber });
      if (!patientToBeLinked||!patient) {
        return res.status(404).json({ message: 'No patients found with the provided email.' });
      }
      patient.linkedPatients.push({
        linkedPatientId: patientToBeLinked._id,
        linkedPatientRelation: relation,
        linkedPatientName:patientToBeLinked.name
      });
      await patient.save();
    }
    
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getLinkedFamilyMembers = async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const linkedFamilyMembers = patient.linkedPatients;
    res.status(200).json(linkedFamilyMembers);
  } catch (error) {
    console.error('Error fetching linked family members:', error);
    res.status(500).json({ error: 'An error occurred while fetching linked family members.' });
  }
};
const getMedicalHistory= async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await Patient.findOne({ username });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const medicalHistory = patient.medicalHistory.map(record => ({
      filename: record.filename,
      path: record.path,
      mimetype: record.mimetype
    }));

    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteMedicalHistory= async (req, res) => {
  const { username, filename } = req.params;

  try {
    const patient = await Patient.findOne({ username });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const recordIndex = patient.medicalHistory.findIndex(record => record.filename === filename);
    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const record = patient.medicalHistory[recordIndex];
    patient.medicalHistory.splice(recordIndex, 1);
    await patient.save();

    res.status(200).json(record);
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}


module.exports={createPatient,getPatients,deletePatient,searchPatientsByName,getMyPrescriptions,searchPatientsByUserame,getPatient,searchPatientsByUSername,linkMemberByEmail,getLinkedFamilyMembers,getMedicalHistory,deleteMedicalHistory}
