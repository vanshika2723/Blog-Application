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

// ===============================
// DELETE BLOG
// ===============================

const deleteBlog = (req, res) => {

    const { id } = req.params;

    const blogIndex = blogs.findIndex(
        blog => String(blog.id) === String(id)
    );

    if (blogIndex === -1) {

        return res.status(404).json({

            message: "Blog not found."

        });

    }

    blogs.splice(blogIndex, 1);

    res.status(200).json({

        message: "Blog deleted successfully."

    });

};
module.exports = {

    createBlog,

    getBlogs,

     deleteBlog

};