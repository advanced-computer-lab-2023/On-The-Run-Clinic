const FamilyMem = require('../models/FamilyMemberModel');

const { default: mongoose } = require('mongoose');

const createMember = async(req,res) => {
   try{ const {
        name,
        national_id,
        age,
        gender,
        relation,
        
      } = req.body;
      const newMember = new FamilyMem({
        name,
        national_id,
        age,
        gender,
        relation,
      });
      await newMember.save();

    res.status(201).json({ message: 'Family Member added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the member' });
  }
}
  module.exports={createMember}









