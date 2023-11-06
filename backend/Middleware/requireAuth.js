const jwt = require('jsonwebtoken')
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const Admin = require('../models/AdmiModel');

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try {
 
    const {user}=jwt.verify(token, "bV5uN2x1ZjM5cDR0YzJWeU9uTjJZaTV0YjI5bmJHVjJaUzF3Y205a2N5")
    const _id = user.id
    const role=user.role
    if(role=="admin"){
        req.user = await Admin.findOne({ _id })
    }
    else if(role=="doctor"){
        req.user = await Doctor.findOne({ _id })
    }
    else{
        req.user = await Patient.findOne({ _id })

    }

    
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'})
  }
}

module.exports = requireAuth