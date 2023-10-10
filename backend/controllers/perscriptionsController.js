const Prescription = require('../models/perscriptionsModel');
const Patient = require('../models/PatientModel');

const createPrescription = async (req, res) => {
    try {
    
      const { patientId,medicationName, dosage, instructions } = req.body;
  
      // Check if the patient exists
      const patient = await Patient.findById(patientId);
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      // Create a new prescription
      const prescription = new Prescription({
        medicationName,
        dosage,
        instructions,
        patient: patientId,
      });
  
      // Save the prescription
      await prescription.save();
  
      // Associate the prescription with the patient
      patient.prescriptions.push(prescription);
      await patient.save();
  
      return res.status(201).json(prescription);
    } catch (error) {
      console.error('Error creating prescription:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get all prescriptions for a patient
  const getPrescriptionsForPatient = async (req, res) => {
    try {
      const { patientId } = req.params;
  
      // Check if the patient exists
      const patient = Patient.find((pat) => pat._id == patientId);

  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      // Retrieve all prescriptions for the patient
      const prescriptions = await Prescription.find({ patient: id });
  
      return res.status(200).json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    createPrescription,
    getPrescriptionsForPatient,
  };