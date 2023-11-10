const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const Admin = require('../models/AdmiModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating OTP
const nodemailer = require('nodemailer'); // For sending emails




const transporter = nodemailer.createTransport({
  service: 'gmail', // Example: 'Gmail'
  auth: {
    user: 'ontherunclinic@gmail.com',
    pass: '0ntherunClinc',
  },
});

// Generate and store OTP
const generateOTP = () => {
  return crypto.randomInt(1000, 9999).toString();
};

// Send OTP via email
const sendOTPByEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: 'Layla.thabet@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

// Route to initiate password reset
const forgetPassword = async (req, res) => {
  const { username, email } = req.body;
  try {
    let user = await Patient.findOne({ username });
    if (!user) {
       user = await Doctor.findOne({ username });
    }
    if (!user) {
       user = await Admin.findOne({ username });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate and store OTP
    const otp = generateOTP();
    
    user.passwordReset = otp;

    // Save user with OTP
    await user.save();

    // Send OTP via email
    await sendOTPByEmail(email, otp);

    return res.status(200).json({ message: 'Check your email for the OTP.' });
  } catch (error) {
    console.error('Error initiating password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Route to reset the password
const resetPassword= async (req, res) => {
  const { username } = req.params;
  const { email, otp, newPassword } = req.body;
  try {
    let user = await Patient.findOne({ username });
    if (!user) {
       user = await Doctor.findOne({ username });
    }
    if (!user) {
       user = await Admin.findOne({ username });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordReset!== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update password
    if(user = await Patient.findOne({ username })){
      await Patient.updateOne(
        {
          username: username,
        },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
    }
    else if(user = await Doctor.findOne({ username })){
      await Doctor.updateOne(
        {
          username: username,
        },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
    } 
    else if(user = await Admin.findOne({ username })){
      await Admin.updateOne(
        {
          username: username,
        },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
    }

    // Clear the password reset data
    user.passwordReset = undefined;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};











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
    const payload = { username: user.username, role: role };
    jwt.sign(
      payload,
      "bV5uN2x1ZjM5cDR0YzJWeU9uTjJZaTV0YjI5bmJHVjJaUzF3Y205a2N5",
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token,role,email,username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
module.exports = {loginUser,forgetPassword,resetPassword};