const HealthPackage=require('../models/HealthPackages')

//create a new user
const { default: mongoose } = require('mongoose');

const createHealthPackage = async(req,res) => {
   //add a new user to the database with 
   //Name,type,password
   const{Price,Services,Type} = req.body ;
   console.log(req.body);
   try {
      const HealthPackage = await HealthPackages.create({Price,Services,Type});
      console.log(HealthPackage);
      res.status(200).json(user)
   }catch(error) {
         res.status(400).json({error:error.message})
       }    
   }


const getUsers = async (req, res) => {
   //retrieve all users from the database
   const users = await userModel.find({}).sort({createdAt : -1});
   for (let index = 0; index < users.length;index++) {
      const element = users[index];
      console.log(element.id);
   }
   res.status(200).json(users)
  }

  const deleteUser = async (req, res) => {
    const { username } =  req.body;
 
    try {
       // Delete the user with the specified username
       const deletedUser = await userModel.findOneAndDelete({ username });
 
       if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
       }
 
       return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
       console.error(error);
       return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
 };

module.exports = {createUser, getUsers, deleteUser};