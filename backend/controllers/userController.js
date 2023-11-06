const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const Admin = require('../models/AdmiModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password)  {
    throw new Error('All fields are required');
  }

  try {
    // Check if user exists
    let user = await Patient.findOne({ username });
    let role = 'patient';
   


    if (!user) {
      user = await Doctor.findOne({ username });
      role = 'doctor';
    }

    if (!user) {
      user = await Admin.findOne({ username });
      role = 'admin';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid Email' });
    }
    let email=user.email;

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create and sign JWT
    const payload = { user: { id: user._id,role: role } };
    jwt.sign(
      payload,
      "bV5uN2x1ZjM5cDR0YzJWeU9uTjJZaTV0YjI5bmJHVjJaUzF3Y205a2N5",
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token,role,email });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
module.exports = {loginUser};