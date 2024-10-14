const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: { 
        type: String,
        required: true
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
