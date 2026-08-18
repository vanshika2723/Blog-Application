const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        },
        userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

        author: {
            type: String,
            required: true
        },

        authorEmail: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["published", "draft"],
            default: "published"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Blog", blogSchema);