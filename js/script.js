// ===============================
// REGISTER FUNCTIONALITY
// ===============================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;

            const registerError =
                document.getElementById(
                    "registerError"
                );

            registerError.textContent = "";


            // Password validation

            if (password.length < 6) {

                registerError.textContent =
                    "Password must be at least 6 characters.";

                return;
            }


            // Confirm password

            if (password !== confirmPassword) {

                registerError.textContent =
                    "Passwords do not match.";

                return;
            }


            // ===============================
            // BACKEND REGISTER API
            // ===============================

            try {

                const response = await fetch(
                    "http://localhost:5000/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    registerError.textContent =
                        data.message ||
                        "Registration failed.";

                    return;
                }


                alert(
                    "Registration successful!"
                );


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Register Error:",
                    error
                );

                registerError.textContent =
                    "Unable to connect to server.";
            }

        }
    );

}


// ===============================
// LOGIN FUNCTIONALITY
// ===============================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;


            const loginError =
                document.getElementById(
                    "loginError"
                );

            loginError.textContent = "";


            // ===============================
            // BACKEND LOGIN API
            // ===============================

            try {

                const response = await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    loginError.textContent =
                        data.message ||
                        "Invalid email or password.";

                    return;
                }


                // Save logged-in user

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(data.user)
                );


                // Dashboard

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                loginError.textContent =
                    "Unable to connect to server.";
            }

        }
    );

}


// ===============================
// DASHBOARD
// ===============================

const welcomeMessage =
    document.getElementById(
        "welcomeMessage"
    );

if (welcomeMessage) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (!loggedInUser) {

        window.location.href =
            "login.html";

    } else {

        welcomeMessage.textContent =
            `Welcome back, ${loggedInUser.name}!`;
    }
}


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "login.html";
        }
    );

}


// ===============================
// CREATE / EDIT BLOG
// ===============================

// ===============================
// CREATE / EDIT BLOG
// ===============================

const blogForm =
    document.getElementById("blogForm");


if (blogForm) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const editBlogId =
        params.get("edit");


    const blogSubmitButton =
        document.getElementById(
            "blogSubmitButton"
        );


    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    // User must be logged in

    if (!loggedInUser) {

        window.location.href =
            "login.html";

    } else {


        // =================================
        // SUBMIT BLOG
        // =================================

        blogForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const title =
                    document
                        .getElementById(
                            "blogTitle"
                        )
                        .value
                        .trim();


                const category =
                    document.getElementById(
                        "blogCategory"
                    ).value;


                const content =
                    document
                        .getElementById(
                            "blogContent"
                        )
                        .value
                        .trim();


                const blogError =
                    document.getElementById(
                        "blogError"
                    );


                blogError.textContent = "";


                // =================================
                // VALIDATION
                // =================================

                if (
                    !title ||
                    !category ||
                    !content
                ) {

                    blogError.textContent =
                        "Please fill all required fields.";

                    return;
                }


                // =================================
                // CREATE BLOG API
                // =================================

                try {

                    const response =
                        await fetch(
                            "http://localhost:5000/api/blogs",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        title:
                                            title,

                                        category:
                                            category,

                                        content:
                                            content,

                                        author:
                                            loggedInUser.name,

                                        authorEmail:
                                            loggedInUser.email

                                    })
                            }
                        );


                    const data =
                        await response.json();


                    // =================================
                    // API ERROR
                    // =================================

                    if (!response.ok) {

                        blogError.textContent =
                            data.message ||
                            "Unable to create blog.";

                        return;
                    }


                    // =================================
                    // SUCCESS
                    // =================================

                    alert(
                        "Blog published successfully!"
                    );


                    console.log(
                        "Created Blog:",
                        data.blog
                    );


                    // Dashboard

                    window.location.href =
                        "dashboard.html";


                } catch (error) {

                    console.error(
                        "Create Blog Error:",
                        error
                    );


                    blogError.textContent =
                        "Unable to connect to server.";
                }

            }
        );
    }
}

// ===============================
// DISPLAY BLOGS ON DASHBOARD
// ===============================

const dashboardBlogList =
    document.getElementById(
        "dashboardBlogList"
    );

if (dashboardBlogList) {

    const blogs =
        JSON.parse(
            localStorage.getItem(
                "blogs"
            )
        ) || [];


    const loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (!loggedInUser) {

        window.location.href =
            "login.html";

    } else {

        const userBlogs =
            blogs.filter(
                blog =>
                    blog.authorEmail ===
                    loggedInUser.email
            );


        // ===============================
        // STATISTICS
        // ===============================

        const totalBlogs =
            document.getElementById(
                "totalBlogs"
            );


        const publishedBlogs =
            document.getElementById(
                "publishedBlogs"
            );


        const draftBlogs =
            document.getElementById(
                "draftBlogs"
            );


        if (totalBlogs) {

            totalBlogs.textContent =
                userBlogs.length;
        }


        if (publishedBlogs) {

            publishedBlogs.textContent =
                userBlogs.filter(
                    blog =>
                        blog.status ===
                        "published"
                ).length;
        }


        if (draftBlogs) {

            draftBlogs.textContent =
                userBlogs.filter(
                    blog =>
                        blog.status ===
                        "draft"
                ).length;
        }


        // ===============================
        // NO BLOGS
        // ===============================

        if (userBlogs.length === 0) {

            dashboardBlogList.innerHTML = `

                <div class="empty-state">

                    <h3>No blogs yet</h3>

                    <p>
                        Start writing your first blog.
                    </p>

                    <a
                        href="create-blog.html"
                        class="dashboard-create-btn"
                    >
                        Create Your First Blog
                    </a>

                </div>

            `;

        } else {

            dashboardBlogList.innerHTML =
                "";


            userBlogs.forEach(
                function (blog) {

                    const blogElement =
                        document.createElement(
                            "article"
                        );


                    blogElement.className =
                        "dashboard-blog-card";


                    blogElement.innerHTML = `

                        <div class="dashboard-blog-content">

                            ${
                                blog.image
                                    ? `
                                        <img
                                            src="${blog.image}"
                                            alt="${blog.title}"
                                            class="dashboard-blog-image"
                                        >
                                      `
                                    : ""
                            }

                            <span class="blog-category">
                                ${blog.category}
                            </span>

                            <h3>
                                ${blog.title}
                            </h3>

                            <p>
                                ${blog.content}
                            </p>

                            <small>
                                Published on
                                ${blog.createdAt}
                            </small>

                        </div>


                        <div class="blog-actions">

                            <a
                                href="create-blog.html?edit=${blog.id}"
                                class="edit-blog-btn"
                            >
                                Edit
                            </a>

                            <button
                                class="delete-blog-btn"
                                data-id="${blog.id}"
                            >
                                Delete
                            </button>

                        </div>

                    `;


                    dashboardBlogList.appendChild(
                        blogElement
                    );

                }
            );
        }
    }
}


// ===============================
// DELETE BLOG
// ===============================

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList.contains(
                "delete-blog-btn"
            )
        ) {

            return;
        }


        const blogId =
            Number(
                event.target.dataset.id
            );


        const confirmDelete =
            confirm(
                "Are you sure you want to delete this blog?"
            );


        if (!confirmDelete) {

            return;
        }


        let blogs =
            JSON.parse(
                localStorage.getItem(
                    "blogs"
                )
            ) || [];


        blogs =
            blogs.filter(
                blog =>
                    blog.id !== blogId
            );


        localStorage.setItem(
            "blogs",
            JSON.stringify(blogs)
        );


        window.location.reload();

    }
);


// ===============================
// DISPLAY BLOGS ON HOME PAGE
// ===============================

const homeBlogContainer =
    document.getElementById(
        "homeBlogContainer"
    );

if (homeBlogContainer) {

    const blogs =
        JSON.parse(
            localStorage.getItem(
                "blogs"
            )
        ) || [];


    const publishedBlogs =
        blogs.filter(
            blog =>
                blog.status ===
                "published"
        );


    // ===============================
    // NO BLOGS
    // ===============================

    if (publishedBlogs.length === 0) {

        homeBlogContainer.innerHTML = `

            <div class="empty-state">

                <h3>No blogs available</h3>

                <p>
                    Be the first one to publish a blog!
                </p>

                <a
                    href="create-blog.html"
                    class="dashboard-create-btn"
                >
                    Create Blog
                </a>

            </div>

        `;

    } else {

        homeBlogContainer.innerHTML =
            "";


        const latestBlogs =
            [...publishedBlogs].reverse();


        latestBlogs.forEach(
            function (blog) {

                const blogCard =
                    document.createElement(
                        "article"
                    );


                blogCard.className =
                    "blog-card";


                blogCard.innerHTML = `

                    ${
                        blog.image
                            ? `
                                <img
                                    src="${blog.image}"
                                    alt="${blog.title}"
                                    class="home-blog-image"
                                >
                              `
                            : ""
                    }

                    <span class="blog-category">
                        ${blog.category}
                    </span>

                    <h3>
                        ${blog.title}
                    </h3>

                    <p>
                        ${blog.content.substring(
                            0,
                            120
                        )}

                        ${
                            blog.content.length > 120
                                ? "..."
                                : ""
                        }
                    </p>

                    <small>
                        By ${blog.author}
                        · ${blog.createdAt}
                    </small>

                    <br>
                    <br>

                    <a
                        href="blog.html?id=${blog.id}"
                        class="read-more"
                    >
                        Read More
                    </a>

                `;


                homeBlogContainer.appendChild(
                    blogCard
                );

            }
        );
    }
}


// ===============================
// BLOG DETAILS PAGE
// ===============================

const blogDetails =
    document.getElementById(
        "blogDetails"
    );

if (blogDetails) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const blogId =
        Number(
            params.get("id")
        );


    const blogs =
        JSON.parse(
            localStorage.getItem(
                "blogs"
            )
        ) || [];


    const blog =
        blogs.find(
            blog =>
                blog.id === blogId
        );


    // ===============================
    // BLOG NOT FOUND
    // ===============================

    if (!blog) {

        blogDetails.innerHTML = `

            <div class="empty-state">

                <h3>Blog not found</h3>

                <p>
                    The blog you are looking for
                    does not exist.
                </p>

                <a
                    href="index.html"
                    class="back-home"
                >
                    Back to Home
                </a>

            </div>

        `;

    } else {

        blogDetails.innerHTML = `

            ${
                blog.image
                    ? `
                        <img
                            src="${blog.image}"
                            alt="${blog.title}"
                            class="blog-details-image"
                        >
                      `
                    : ""
            }

            <span class="blog-category">
                ${blog.category}
            </span>

            <h2>
                ${blog.title}
            </h2>

            <p class="blog-author">

                By ${blog.author}

                · Published on
                ${blog.createdAt}

            </p>

            <div class="blog-content">

                ${blog.content}

            </div>

            <a
                href="index.html"
                class="back-home"
            >
                ← Back to Home
            </a>

        `;
    }
}


// ===============================
// BLOG IMAGE PREVIEW
// ===============================

const blogImage =
    document.getElementById(
        "blogImage"
    );


const imagePreview =
    document.getElementById(
        "imagePreview"
    );


const imagePreviewContainer =
    document.getElementById(
        "imagePreviewContainer"
    );


if (
    blogImage &&
    imagePreview &&
    imagePreviewContainer
) {

    blogImage.addEventListener(
        "change",
        function () {

            const file =
                blogImage.files[0];


            if (!file) {

                imagePreview.src = "";

                imagePreviewContainer.style.display =
                    "none";

                return;
            }


            // Check image

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image file."
                );

                blogImage.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    imagePreview.src =
                        event.target.result;

                    imagePreviewContainer.style.display =
                        "block";
                };


            reader.readAsDataURL(file);

        }
    );

}


// ===============================
// IMAGE TO BASE64
// ===============================

function convertImageToBase64(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );
                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Image could not be read."
                        )
                    );
                };


            reader.readAsDataURL(file);

        }
    );
}