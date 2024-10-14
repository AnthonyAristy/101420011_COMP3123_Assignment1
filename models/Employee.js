const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: { 
        type: String,
        required: true,
        lowercase: true // Remove unique if you expect duplicates
    },
    last_name: { 
        type: String,
        required: true,
        lowercase: true // Remove unique if you expect duplicates
    },
    email: { 
        type: String,
        required: true,
        unique: true // Email should be unique
    },
    position: { 
        type: String,
        required: true,
        lowercase: true // Remove unique if you expect duplicates
    },
    salary: { 
        type: Number,
        required: true
    },
    date_of_joining: { 
        type: Date, 
        required: true 
    },
    department: { 
        type: String,
        required: true,
        lowercase: true // Remove unique if you expect duplicates
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;

