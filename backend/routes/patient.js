const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const {createPatient,getPatients,searchPatientsByName,getMyPrescriptions,searchPatientsByUserame,deletePatient,getPatient,linkMemberByEmail,getLinkedFamilyMembers,getMedicalHistory,deleteMedicalHistory,payByPackage,updatePasswordPatient} = require("../controllers/patientController")

// GET all patients
router.get('/', patientController.getAllPatients);

// GET a single patient by ID
router.get('/:id', patientController.getPatientById);

// POST a new patient
router.post('/', patientController.createPatient);

// PUT update a patient by ID
router.put('/:id', patientController.updatePatientById);

// DELETE a patient by ID
router.delete('/:id', patientController.deletePatientById);

module.exports = router;
