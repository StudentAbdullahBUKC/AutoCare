const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// @route   POST api/appointments
// @desc    Book an appointment
// @access  Private
router.post('/', auth, async (req, res) => {
    const { serviceId, date, timeSlot } = req.body;
    try {
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ msg: 'Service not found' });

        const newAppointment = new Appointment({
            user: req.user.id,
            service: serviceId,
            date,
            timeSlot
        });

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments/history
// @desc    Get user's appointments
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id })
            .populate('service', ['name', 'price', 'duration'])
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments
// @desc    Get all appointments (Admin)
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const appointments = await Appointment.find()
            .populate('user', ['name', 'email'])
            .populate('service', ['name'])
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/appointments/:id/status
// @desc    Update appointment status (Admin)
// @access  Private (Admin only)
router.put('/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    const { status } = req.body;
    try {
        let appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
