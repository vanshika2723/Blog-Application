const express = require("express");
const cors = require("cors");


require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const blogRoutes =
    require("./routes/blogRoutes");


const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(
    express.json()
);


// =====================================
// ROUTES
// =====================================

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/blogs",
    blogRoutes
);


// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {

    res.json({
        message:
            "Blog API Server is running!"
    });

});


// =====================================
// SERVER
// =====================================

const PORT = 5000;
connectDB();
app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);