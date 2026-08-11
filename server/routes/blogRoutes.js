const express = require("express");

const router = express.Router();


// =====================================
// CREATE BLOG
// POST /api/blogs
// =====================================

router.post("/", (req, res) => {

    const {
        title,
        category,
        content,
        author,
        authorEmail
    } = req.body;


    // =====================================
    // VALIDATION
    // =====================================

    if (
        !title ||
        !category ||
        !content
    ) {

        return res.status(400).json({
            message:
                "Title, category and content are required."
        });
    }


    // =====================================
    // TEMPORARY BLOG
    // Database next module mein
    // =====================================

    const blog = {

        id: Date.now(),

        title: title,

        category: category,

        content: content,

        author:
            author || "Unknown",

        authorEmail:
            authorEmail || "",

        createdAt:
            new Date().toLocaleDateString(),

        status:
            "published"
    };


    // =====================================
    // RESPONSE
    // =====================================

    return res.status(201).json({

        message:
            "Blog created successfully.",

        blog: blog

    });

});


module.exports = router;