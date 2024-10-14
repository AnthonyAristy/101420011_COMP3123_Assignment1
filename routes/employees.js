/*
    /api/v1/emp/employees
    /api/v1/emp/employees
    /api/v1/emp/employees/{eid}
    /api/v1/emp/employees/{eid} 
    /api/v1/emp/employees?eid=xxx
*/

require('dotenv').config(); // Load environment variables

const express = require('express');
const User = require('../models/User');
const Employee = require('../models/Employee'); // Import Employee model
const routes = express.Router();
const mongoose = require("mongoose");

// Update your connection string
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB for employees! connected well!!");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Get employee list
routes.get('/employees', async (req, res) => {
    // User authorization
    if (!req.session.userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    // Get login information
    const user = await User.findById(req.session.userId);
    const employees = await Employee.find(); // Get employee list

    // Map employee data to the desired format
    const formattedEmployees = employees.map(employee => ({
        employee_id: employee._id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        position: employee.position,
        salary: employee.salary,
        date_of_joining: employee.date_of_joining,
        department: employee.department
    }));

    res.send({ message: `Welcome! ${user.username}`, data: formattedEmployees });
});

// Post employees
routes.post('/employees', async (req, res) => {
    try {
        const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

        // Create new employee
        const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        });

        const savedEmployee = await newEmployee.save();

        res.status(201).send({ 
            message: 'Employee created successfully.', 
            employee_id: savedEmployee._id // Return employee ID
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// User can get employee details by employee id
routes.get("/employees/:eid", async (req, res) => {
    // User authorization
    if (!req.session.userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const employee = await Employee.findById(req.params.eid);
        if (employee) {
            res.send(employee);
        } else {
            res.status(404).send({ message: "We cannot find the employee. Please check again" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// User can update employee details
routes.put('/employees/:eid', async (req, res) => {
    // User authorization
    if (!req.session.userId) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.eid, req.body, { new: true });
        if (updatedEmployee) {
            res.send({ message: "Employee details updated successfully." });
        } else {
            res.status(404).send({ message: "We cannot find the employee" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// User can delete employee by employee ID
routes.delete("/employees/:eid", async (req, res) => {
    const employeeId = req.params.eid; // Use URL parameter

    if (!employeeId) {
        return res.status(400).send({ message: "Employee ID is required" });
    }

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
        if (deletedEmployee) {
            res.send({ message: "Employee deleted successfully." });
        } else {
            res.status(404).send({ message: "We cannot find the employee" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


module.exports = routes;
