// Import necessary modules and models
const express = require('express');

const Admin= require('../models/AdmiModel'); // Import your Admin model

/*const getAdmins=async(req,res) =>{
  const users =await Admin.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
         console.log(element.id);
      }
      res.status(200).json(users)
}*/
// Register Doctor Controller
const createAdmin = async(req,res) => {
  try {
    // Extract data from the request body
    const {
      username,
      password
     } =req.body
    const newAdmin = new Admin({
        username,
        password // Hash the password before saving (use a library like bcrypt)
      });
    
    // Save the new doctor to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the Admin' });
  }

};
const getAdmin=async(req,res) =>{
  const users =await Admin.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
         console.log(element.id);
      }
      res.status(200).json(users)
}
module.exports={createAdmin,getAdmin}
