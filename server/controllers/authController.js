const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let users = [];


// ============================================================
// GENERATE JWT TOKEN
// ============================================================

function generateToken(user) {

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
}


// ============================================================
// REGISTER
// ============================================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Validation
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required."
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });

        }


        // Normalize email
        const normalizedEmail =
            email.trim().toLowerCase();


        // Check existing user
        const existingUser =
            users.find(
                user =>
                    user.email === normalizedEmail
            );


        if (existingUser) {

            return res.status(400).json({
                message: "User already exists."
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const newUser = {

            id: Date.now(),

            name: name.trim(),

            email: normalizedEmail,

            password: hashedPassword

        };


        users.push(newUser);


        // Response
        res.status(201).json({

            message: "Registration successful.",

            user: {

                id: newUser.id,

                name: newUser.name,

                email: newUser.email

            }

        });


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        res.status(500).json({

            message:
                "Server error during registration."

        });

    }

};


// ============================================================
// LOGIN
// ============================================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validation
        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required."

            });

        }


        // Normalize email
        const normalizedEmail =
            email.trim().toLowerCase();


        // Find user
        const user =
            users.find(
                user =>
                    user.email === normalizedEmail
            );


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        // Generate JWT
        const token =
            generateToken(user);


        // Response
        res.json({

            message:
                "Login successful.",

            token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email

            }

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            message:
                "Server error during login."

        });

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    registerUser,

    loginUser

};