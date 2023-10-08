const Request = require('../models/requestsModel'); 



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



module.exports = { createRequest,getOneRequest };






