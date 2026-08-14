const express = require("express");
const Blog = require("../models/Blog");

const router = express.Router();


// =====================================
// CREATE BLOG
// POST /api/blogs
// =====================================

router.post("/", async (req, res) => {
    try {

        const {
            title,
            category,
            content,
            image,
            author,
            authorEmail
        } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Title, category and content are required."
            });
        }

        const blog = await Blog.create({
            title,
            category,
            content,
            image: image || "",
            author: author || "Unknown",
            authorEmail: authorEmail || "",
            status: "published"
        });

        return res.status(201).json({
            message: "Blog created successfully.",
            blog
        });

    } catch (error) {

        console.error("Create Blog Error:", error);

        return res.status(500).json({
            message: "Server error while creating blog."
        });
    }
});


// =====================================
// GET ALL BLOGS
// GET /api/blogs
// =====================================

router.get("/", async (req, res) => {
    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            blogs
        });

    } catch (error) {

        console.error("Get Blogs Error:", error);

        return res.status(500).json({
            message: "Server error while fetching blogs."
        });
    }
});


// =====================================
// GET SINGLE BLOG
// GET /api/blogs/:id
// =====================================

router.get("/:id", async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        return res.status(200).json({
            blog
        });

    } catch (error) {

        console.error("Get Blog Error:", error);

        return res.status(500).json({
            message: "Server error while fetching blog."
        });
    }
});


// =====================================
// UPDATE BLOG
// PUT /api/blogs/:id
// =====================================

router.put("/:id", async (req, res) => {
    try {

        const {
            title,
            category,
            content,
            image
        } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Title, category and content are required."
            });
        }

        const updateData = {
            title,
            category,
            content
        };

        if (image) {
            updateData.image = image;
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        return res.status(200).json({
            message: "Blog updated successfully.",
            blog
        });

    } catch (error) {

        console.error("Update Blog Error:", error);

        return res.status(500).json({
            message: "Server error while updating blog."
        });
    }
});


// =====================================
// DELETE BLOG
// DELETE /api/blogs/:id
// =====================================

router.delete("/:id", async (req, res) => {
    try {

        const blog = await Blog.findByIdAndDelete(
            req.params.id
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        return res.status(200).json({
            message: "Blog deleted successfully."
        });

    } catch (error) {

        console.error("Delete Blog Error:", error);

        return res.status(500).json({
            message: "Server error while deleting blog."
        });
    }
});


module.exports = router;