let blogs = [];


// ===============================
// CREATE BLOG
// ===============================

const createBlog = (req, res) => {

    const {
        title,
        category,
        content,
        author
    } = req.body;


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


    const newBlog = {

        id: Date.now(),

        title,

        category,

        content,

        author: author || "Anonymous",

        createdAt:
            new Date().toLocaleDateString(),

        status: "published"

    };


    blogs.push(newBlog);


    res.status(201).json({

        message:
            "Blog created successfully.",

        blog: newBlog

    });

};


// ===============================
// GET BLOGS
// ===============================

const getBlogs = (req, res) => {

    res.json({

        blogs

    });

};


module.exports = {

    createBlog,

    getBlogs

};