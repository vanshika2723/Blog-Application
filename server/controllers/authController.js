let users = [];


// ===============================
// REGISTER
// ===============================

const registerUser = (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "All fields are required."
        });
    }

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {

        return res.status(400).json({
            message: "User already exists."
        });
    }

    const newUser = {

        id: Date.now(),

        name,

        email,

        password
    };

    users.push(newUser);

    res.status(201).json({

        message: "Registration successful.",

        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }

    });
};


// ===============================
// LOGIN
// ===============================

const loginUser = (req, res) => {

    const {
        email,
        password
    } = req.body;

    const user = users.find(

        user =>
            user.email === email &&
            user.password === password

    );

    if (!user) {

        return res.status(401).json({

            message: "Invalid email or password."

        });
    }

    res.json({

        message: "Login successful.",

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    });
};


module.exports = {
    registerUser,
    loginUser
};