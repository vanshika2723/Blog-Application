const express = require("express");
const Blog = require("../models/Blog");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// CREATE BLOG
// POST /api/blogs
// LOGIN REQUIRED
// =====================================

router.post("/", protect, async (req, res) => {
    try {

        const {
            title,
            category,
            content,
            image
        } = req.body;


        if (!title || !category || !content) {

            return res.status(400).json({
                message:
                    "Title, category and content are required."
            });

        }


        const blog = await Blog.create({

            title: title.trim(),

            category,

            content,

            image: image || "",

            // User information from JWT
            userId: req.user.id,

            author: req.user.name,

            authorEmail: req.user.email,

            status: "published"

        });


        return res.status(201).json({

            message:
                "Blog created successfully.",

            blog

        });

    } catch (error) {

        console.error(
            "Create Blog Error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while creating blog."

        });

    }
});


// =====================================
// GET ALL BLOGS
// GET /api/blogs
// PUBLIC
// =====================================

router.get("/", async (req, res) => {

    try {

        const blogs =
            await Blog.find()
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            blogs

        });

    } catch (error) {

        console.error(
            "Get Blogs Error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while fetching blogs."

        });

    }

});


// =====================================
// GET MY BLOGS
// GET /api/blogs/my-blogs
// LOGIN REQUIRED
// =====================================

router.get("/my-blogs", protect, async (req, res) => {

    try {

        const blogs =
            await Blog.find({
                userId: req.user.id
            })
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            blogs

        });

    } catch (error) {

        console.error(
            "Get My Blogs Error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while fetching your blogs."

        });

    }

});


// =====================================
// GET SINGLE BLOG
// GET /api/blogs/:id
// PUBLIC
// =====================================

router.get("/:id", async (req, res) => {

    try {

        const blog =
            await Blog.findById(
                req.params.id
            );


        if (!blog) {

            return res.status(404).json({

                message:
                    "Blog not found."

            });

        }


        return res.status(200).json({

            blog

        });

    } catch (error) {

        console.error(
            "Get Blog Error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while fetching blog."

        });

    }

});


// =====================================
// UPDATE BLOG
// PUT /api/blogs/:id
// LOGIN REQUIRED
// ONLY BLOG OWNER
// =====================================

router.put("/:id", protect, async (req, res) => {

    try {

        const {
            title,
            category,
            content,
            image
        } = req.body;


        if (!title || !category || !content) {

            return res.status(400).json({

                message:
                    "Title, category and content are required."

            });

        }


        // Find blog
        const existingBlog =
            await Blog.findById(
                req.params.id
            );


        if (!existingBlog) {

            return res.status(404).json({

                message:
                    "Blog not found."

            });

        }


        // Check owner using userId
        if (
            String(existingBlog.userId) !==
            String(req.user.id)
        ) {

            return res.status(403).json({

                message:
                    "You are not authorized to update this blog."

            });

        }


        const updateData = {

            title: title.trim(),

            category,

            content

        };


        if (image) {

            updateData.image =
                image;

        }


        const blog =
            await Blog.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true,
                    runValidators: true
                }

            );


        return res.status(200).json({

            message:
                "Blog updated successfully.",

            blog

        });

    } catch (error) {

        console.error(
            "Update Blog Error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while updating blog."

        });

    }

});


// =====================================
// DELETE BLOG
// DELETE /api/blogs/:id
// LOGIN REQUIRED
// ONLY BLOG OWNER
// =====================================

router.delete("/:id", protect, async (req, res) => {

    try {

        const blog =
            await Blog.findById(
                req.params.id
            );


        if (!blog) {

            return res.status(404).json({

                message:
                    "Blog not found."

            });

        }


        // Check owner
        if (
            String(blog.userId) !==
            String(req.user.id)
        ) {

            return res.status(403).json({

                message:
                    "You are not authorized to delete this blog."

            });

        }


        await Blog.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            message:
                "Blog deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete Blog Error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while deleting blog."

        });

    }

});


module.exports = router;