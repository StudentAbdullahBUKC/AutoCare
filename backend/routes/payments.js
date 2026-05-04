const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const crypto = require('crypto');

// @route   POST api/payments
// @desc    Mock checkout
// @access  Private
router.post('/', auth, async (req, res) => {
    const { appointmentId, amount, paymentMethod } = req.body;
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        
        // Mocking a successful payment process
        const transactionId = crypto.randomBytes(16).toString('hex');
        
        const newPayment = new Payment({
            appointment: appointmentId,
            user: req.user.id,
            amount,
            paymentMethod,
            transactionId,
            status: 'completed'
        });

        const payment = await newPayment.save();
        
        // Update appointment status to confirmed
        appointment.status = 'confirmed';
        await appointment.save();

        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
