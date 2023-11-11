const Request = require('../models/requestsModel'); 
const multer = require('multer');


const upload = multer({ storage: multer.memoryStorage() });
const createRequest = async (req, res) => {
    try {
        // Extract request data from the request body
        const {
          username,
          name,
          email,
          password,
          date_of_birth,
          hourly_rate,
          speciality,
          educational_background,
        } = req.body;

        let reqDocs = [];
        if (req.files) {
          reqDocs = req.files.map(file => ({
            data: file.buffer,
            mimetype: file.mimetype,
            name: file.originalname,
          }));
        }
    
    
    
        // Create a new request object
        const request = new Request({
          username,
          name,
          email,
          password,
          date_of_birth,
          hourly_rate,
          speciality,
          educational_background,
          reqDocs,
          
        });
    
        // Save the request to the database
        await request.save();
    
        // Respond with a success message
        res.status(201).json({ message: 'Doctor registration request submitted successfully.' });
      } catch (error) {
        console.error('Error submitting doctor registration request:', error);
        res.status(500).json({ message: 'Internal server error' });
      }


      

};
const getOneRequest = async (req, res) => {
  try {
    const { username } = req.query;
    
    // Use a case-insensitive regular expression to search for requests by username
    const drequest = await Request.find({ username: username });

    if (drequest.length === 0) {
      return res.status(404).json({ message: 'No request found with the provided doctor username.' });
    }

    res.status(200).json(drequest);
  } catch (error) {
    console.error('Error searching for a doctor request by username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getRequests=async(req,res) =>{
  const users =await Request.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
        console.log(element.id);
      }
      res.status(200).json(users)
}
const deleteRequest = async(req,res) => {
  try {
    // Extracts the doctor ID from the request parameters
    const { id } = req.params;

    // Finds the doctor by ID and delete them from the database
    const deletedUser = await Request.findByIdAndDelete({ _id:id });

    res.status(200).json({ message: 'Request deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor.' });
  }
};
const rejectrequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Finds the request by ID and updates the status to "rejected"
    const updatedRequest = await Request.findByIdAndUpdate(
      { _id: id },
      { status1: 'rejected' },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request rejected successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rejecting the request.' });
  }
};



module.exports = { createRequest,getOneRequest,getRequests,deleteRequest,rejectrequest };






