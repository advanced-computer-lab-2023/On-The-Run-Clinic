const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
     },
    price: {
      type: String,
      required: true,
      unique: true // Ensures username uniqueness
   },
   services: [
    {
       type: String,
       required: true,
    },
 ],
   type: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum'],
    required: true,
 }
   
});

module.exports = mongoose.model('User', userSchema);