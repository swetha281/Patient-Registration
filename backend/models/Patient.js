const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  name: { type: String, required: [true, 'Name is mandatory'] },
  age: {
    type: Number,
    required: true,
    min: [0, 'Age must be between 0 and 120'],
    max: [120, 'Age must be between 0 and 120']
  },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits']
  },
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true }); 

module.exports = mongoose.model('Patient', patientSchema);