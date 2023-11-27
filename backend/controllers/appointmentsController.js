// Import necessary modules and models
const express = require('express');
const Appointment = require('../models/appointments');
const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel');
const FamilyMember = require ('../models/FamilyMemberModel'); // Import your Patient model
const Notification = require ('../models/notificationModel');


const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, status, description , hour } = req.body;

    const existingAppointment = await Appointment.findOne({ doctorId, date , hour });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Duplicate appointment found' });
    }

    // Fetch the doctor and patient objects
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!patient) {
      const appointment = new Appointment({ doctorId, date ,description : "empty", hour });
      await appointment.save();
      return  res.status(201).json({ message: 'Appointment created successfully', appointment });
    }

    const appointment = new Appointment({ patientId, doctorId, date, status, description , hour });
    await appointment.save();

    if (!doctor.patients.includes(patientId)) {
      const doctorUsername = doctor.username;
      const patientUsername = patient.username;
  
      if (Array.isArray(doctor.patients) && !doctor.patients.includes(patientUsername)) {
        console.log('Before:', doctor.patients);
        doctor.patients.push(patient._id);
        await doctor.save();
        console.log('After:', doctor.patients);
      }
  
      if (Array.isArray(patient.myDoctors) && !patient.myDoctors.includes(doctorUsername)) {
        patient.myDoctors.push(doctor._id);
        await patient.save();
      }
    }


    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
};

const reserveAppointment = async(req,res) => {
  try {
    const { appointmentId } = req.params;
    const { patientId, status, description , paymentMethod} = req.body;
    const appointment = await Appointment.findById(appointmentId);
    console.log(patientId + " pid"+ status) ;
    const doctor = await Doctor.findById(appointment.doctorId);
    console.log("d"+doctor);
    const patient = await Patient.findById(patientId);
    console.log("P"+patient);

    if (!appointment) {
      console.log(" app not found");
    }

    if(paymentMethod=="wallet") {
      console.log("wallet " + patient.wallet); 
      if(patient.wallet<doctor.hourly_rate) {
        return res.status(400).json({ error: 'Not enough money in wallet' });
      }
      else {
        patient.wallet = patient.wallet - doctor.hourly_rate;
      console.log("wallet " + patient.wallet); 

      }
    }

    appointment.patientId = patientId;
    appointment.status = status;
    appointment.description = description;
    await appointment.save();



    if (!doctor.patients.includes(patientId)) {
      const doctorUsername = doctor.username;
      const patientUsername = patient.username;
  
      if (Array.isArray(doctor.patients) && !doctor.patients.includes(patientUsername)) {
        console.log('Before:', doctor.patients);
        doctor.patients.push(patient._id);
        await doctor.save();
        console.log('After:', doctor.patients);
      }
  
      if (Array.isArray(patient.myDoctors) && !patient.myDoctors.includes(doctorUsername)) {
        patient.myDoctors.push(doctor._id);
        await patient.save();
      }
    }

    const msgP = `You have successfully reserved an appointment with doctor ${doctor.name} on ${appointment.date} `;
    const notificationP = new Notification({msgP});
    patient.notifications.push(notificationP);

    const msgD = `${patient.name} has successfully reserved an appointment with you on ${appointment.date} `;
    const notificationD = new Notification({msgD});
    doctor.notifications.push(notificationD);

    return res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error('Error reserving appointment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const reserveFamilyMemberAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { patientId ,status, description, familyMemberId , paymentMethod } = req.body;

    // Check if the family member ID is provided
    if (!familyMemberId) {
      return res.status(400).json({ error: 'Family member ID is required' });
    }

    const familyMember = await FamilyMember.findById(familyMemberId);
    
    if (!familyMember) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    const patient = await Patient.findById(patientId);
    if(!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    // Use the family member ID to find the family member
    
    const doctor = await Doctor.findById(appointment.doctorId);
    if(!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if(paymentMethod=="wallet") {
      if(patient.wallet<doctor.hourly_rate) {
        return res.status(400).json({ error: 'Not enough money in wallet' });
      }
      else {
        patient.wallet = patient.wallet - doctor.hourly_rate;
      }
    }
    // Update the appointment details
    appointment.patientId = patientId; // Assign the family member ID
    appointment.status = status;
    appointment.description = description;
    await appointment.save();


    // Update the doctor's patient list if necessary
    if (!doctor.patients.includes(familyMemberId)) {
      const doctorUsername = doctor.username;
      const familyMemberUsername = familyMember.username;
  
      if (Array.isArray(doctor.patients) && !doctor.patients.includes(familyMemberUsername)) {
        console.log('Before:', doctor.patients);
        doctor.patients.push(familyMemberId);
        await doctor.save();
        console.log('After:', doctor.patients);
      }
  
      if (Array.isArray(familyMember.myDoctors) && !familyMember.myDoctors.includes(doctorUsername)) {
        familyMember.myDoctors.push(doctor._id);
        await familyMember.save();
      }
    }

    return res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error('Error reserving family member appointment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const reserveLinkedPatientAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { patientId, status, description, linkedPatientId, paymentMethod } = req.body;

    // Check if the linked patient ID is provided
    if (!linkedPatientId) {
      return res.status(400).json({ error: 'Linked patient ID is required' });
    }

    const linkedPatient = await Patient.findById(linkedPatientId);
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const doctor = await Doctor.findById(appointment.doctorId);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (!linkedPatient) {
      return res.status(404).json({ error: 'Linked patient not found' });
    }

    if (paymentMethod === 'wallet') {
      if (patient.wallet < doctor.hourly_rate) {
        return res.status(400).json({ error: 'Not enough money in the wallet' });
      } else {
        patient.wallet = patient.wallet - doctor.hourly_rate;
      }
    }

    // Update the appointment details
    appointment.patientId = linkedPatientId; // Assign the linked patient ID
    appointment.status = status;
    appointment.description = description;
    await appointment.save();

    // Update the doctor's patient list if necessary
    if (!doctor.patients.includes(linkedPatientId)) {
      const doctorUsername = doctor.username;
      const linkedPatientUsername = linkedPatient.username;

      if (Array.isArray(doctor.patients) && !doctor.patients.includes(linkedPatientUsername)) {
        console.log('Before:', doctor.patients);
        doctor.patients.push(linkedPatientId);
        await doctor.save();
        console.log('After:', doctor.patients);
      }

      if (Array.isArray(linkedPatient.myDoctors) && !linkedPatient.myDoctors.includes(doctorUsername)) {
        linkedPatient.myDoctors.push(doctor._id);
        await linkedPatient.save();
      }
    }

    return res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error('Error reserving linked patient appointment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching appointments' });
      }
};

const getAvailableDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params; // Get the doctor's ID from the request parameters

    // Check if the doctor exists
    
    // Fetch appointments for the specified doctor
    const appointments = await Appointment.find({ doctorId: id, status:'Available'});

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const filter=async(req,res) =>{
    try {
        const { date, status } = req.query;
        const filters = {};
        
        if (date) {
          filters.date = new Date(date);
        }
    
        if (status) {
          filters.status = status;
        }
    
        const filteredAppointments = await Appointment.find(filters);
        res.status(200).json(filteredAppointments);
      } catch (error) {
        console.error('Error filtering appointments:', error);
        res.status(500).json({ error: 'An error occurred while filtering appointments' });
      }
}
const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params; // Get the doctor's ID from the request parameters

    // Check if the doctor exists
    
    // Fetch appointments for the specified doctor
    const appointments = await Appointment.find({ doctorId: id });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const { id } = req.params; 
    
    // Fetch appointments for the specified patient
    const appointments = await Appointment.find({ patientId: id });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports={createAppointment,getAllAppointments,filter,getDoctorAppointments,getPatientAppointments,getAvailableDoctorAppointments,reserveAppointment,reserveFamilyMemberAppointment,reserveLinkedPatientAppointment}
