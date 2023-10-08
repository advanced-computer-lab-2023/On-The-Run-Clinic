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
          affiliation,
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
          affiliation,
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

module.exports = { createRequest };






