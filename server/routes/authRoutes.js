const express = require("express");
const User = require("../models/User");

const router = express.Router();


// =====================================
// REGISTER
// POST /api/auth/register
// =====================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Validation

        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "Name, email and password are required."
            });
        }


        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters."
            });
        }


        // Check existing user

        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingUser) {

            return res.status(400).json({
                message:
                    "An account with this email already exists."
            });
        }


        // Create user

        const user =
            await User.create({

                name: name,

                email:
                    email.toLowerCase(),

                password:
                    password

            });


        // Response

        return res.status(201).json({

            message:
                "Registration successful.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.error(
            "Register Error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error during registration."
        });
    }

});


// =====================================
// LOGIN
// POST /api/auth/login
// =====================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required."
            });
        }


        // Find user

        const user =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });
        }


        // Check password

        if (user.password !== password) {

            return res.status(401).json({
                message:
                    "Invalid email or password."
            });
        }


        return res.status(200).json({

            message:
                "Login successful.",

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error during login."
        });
    }

});


module.exports = router;