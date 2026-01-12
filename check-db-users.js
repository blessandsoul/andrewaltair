const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkUsers() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env.local');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const count = await User.countDocuments();
        const users = await User.find().limit(5).select('username email role').lean();

        console.log(`\n-------------------\nTotal Users: ${count}\n-------------------`);
        if (users.length > 0) {
            console.log('Sample Users:');
            console.table(users);
        } else {
            console.log('No users found in database.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();
