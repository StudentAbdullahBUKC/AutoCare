const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Seed data for services
const seedServices = [
    {
        name: 'Oil Change',
        description: 'Full synthetic oil change with filter replacement. Keeps your engine running smoothly.',
        price: 45,
        duration: 30
    },
    {
        name: 'Car Wash & Detailing',
        description: 'Full exterior and interior cleaning, polish, and wax. Your car will look brand new.',
        price: 60,
        duration: 60
    },
    {
        name: 'Vehicle Diagnostics',
        description: 'Complete computer diagnostics scan to identify any issues with your vehicle.',
        price: 80,
        duration: 45
    },
    {
        name: 'Brake Inspection & Service',
        description: 'Comprehensive brake pad, rotor, and caliper inspection and replacement if needed.',
        price: 120,
        duration: 90
    },
    {
        name: 'Tire Rotation & Balancing',
        description: 'Extends tire life and improves ride quality by rotating and balancing all four tires.',
        price: 35,
        duration: 45
    },
    {
        name: 'Air Conditioning Service',
        description: 'AC system check, recharge, and leak inspection to keep you cool all summer.',
        price: 95,
        duration: 60
    }
];

const connectDB = async () => {
    try {
        const mongoServer = await MongoMemoryServer.create();
        const mongoURI = mongoServer.getUri();
        await mongoose.connect(mongoURI);
        console.log('MongoDB Memory Server Connected...');

        // Seed initial services so the app is usable immediately
        const Service = require('../models/Service');
        const count = await Service.countDocuments();
        if (count === 0) {
            await Service.insertMany(seedServices);
            console.log(`✅ Seeded ${seedServices.length} services into the database.`);
        }
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
