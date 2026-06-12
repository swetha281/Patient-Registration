const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// POST - Add patient
router.post('/', async (req, res) => {
  try {
    const lastPatient = await Patient.findOne().sort({ _id: -1 });
    let newNumber = 1;
    if (lastPatient && lastPatient.patientId) {
      const lastNumber = parseInt(lastPatient.patientId.replace('PAT', ''));
      newNumber = lastNumber + 1;
    }
    const patientId = 'PAT' + String(newNumber).padStart(4, '0');
    const patient = new Patient({ ...req.body, patientId });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - All patients (search + pagination)
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search } }
        ]
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      patients,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Single patient
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update patient
router.put('/:id', async (req, res) => {
  try {
    const { name, age, gender, mobile } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, mobile },
      { new: true, runValidators: true }
    );
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;