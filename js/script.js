// ============================================================
// MY BLOG APPLICATION - COMPLETE JAVASCRIPT
// MONGODB + AUTH + BLOG CRUD + SEARCH + CATEGORY FILTER
// ============================================================


// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL = "http://localhost:5000/api";


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getLoggedInUser() {

    try {

        return JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    } catch (error) {

        return null;

    }

}


function saveLoggedInUser(user) {

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );

}


function redirectToLogin() {

    window.location.href = "login.html";

}


// ============================================================
// REGISTER
// ============================================================

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


            if (registerError) {

                registerError.textContent = "";

            }


            // Validation

            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                if (registerError) {

                    registerError.textContent =
                        "Please fill all fields.";

                }

                return;

            }


            if (password.length < 6) {

                if (registerError) {

                    registerError.textContent =
                        "Password must be at least 6 characters.";

                }

                return;

            }


            if (password !== confirmPassword) {

                if (registerError) {

                    registerError.textContent =
                        "Passwords do not match.";

                }

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    email,
                                    password
                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    if (registerError) {

                        registerError.textContent =
                            data.message ||
                            "Registration failed.";

                    }

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


                if (registerError) {

                    registerError.textContent =
                        "Unable to connect to server.";

                }

            }

        }
    );

}


// ============================================================
// LOGIN
// ============================================================

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


            if (loginError) {

                loginError.textContent = "";

            }


            if (!email || !password) {

                if (loginError) {

                    loginError.textContent =
                        "Please enter email and password.";

                }

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    if (loginError) {

                        loginError.textContent =
                            data.message ||
                            "Invalid email or password.";

                    }

                    return;

                }


                // Save logged in user

                saveLoggedInUser(
                    data.user
                );


                // Redirect to dashboard

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                if (loginError) {

                    loginError.textContent =
                        "Unable to connect to server.";

                }

            }

        }
    );

}


// ============================================================
// DASHBOARD AUTHENTICATION
// ============================================================

const welcomeMessage =
    document.getElementById(
        "welcomeMessage"
    );


if (welcomeMessage) {

    const loggedInUser =
        getLoggedInUser();


    if (!loggedInUser) {

        redirectToLogin();

    } else {

        welcomeMessage.textContent =
            `Welcome back, ${loggedInUser.name}!`;

    }

}


// ============================================================
// LOGOUT
// ============================================================

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


// ============================================================
// CREATE / EDIT BLOG
// ============================================================

const blogForm =
    document.getElementById(
        "blogForm"
    );


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
        getLoggedInUser();


    // User must login

    if (!loggedInUser) {

        redirectToLogin();

    } else {


        // ====================================================
        // EDIT MODE
        // ====================================================

        if (editBlogId) {

            if (blogSubmitButton) {

                blogSubmitButton.innerHTML =
                    `<span>✏️</span> Update Blog`;

            }


            loadBlogForEdit(
                editBlogId
            );

        }


        // ====================================================
        // SUBMIT BLOG
        // ====================================================

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
                    document
                        .getElementById(
                            "blogCategory"
                        )
                        .value;


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


                if (blogError) {

                    blogError.textContent = "";

                }


                // Validation

                if (
                    !title ||
                    !category ||
                    !content
                ) {

                    if (blogError) {

                        blogError.textContent =
                            "Please fill all required fields.";

                    }

                    return;

                }


                try {


                    // =================================================
                    // IMAGE
                    // =================================================

                    let image = null;


                    const imageInput =
                        document.getElementById(
                            "blogImage"
                        );


                    if (
                        imageInput &&
                        imageInput.files &&
                        imageInput.files[0]
                    ) {

                        image =
                            await convertImageToBase64(
                                imageInput.files[0]
                            );

                    }


                    // =================================================
                    // CREATE BLOG
                    // =================================================

                    if (!editBlogId) {

                        const response =
                            await fetch(
                                `${API_URL}/blogs`,
                                {

                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            title,

                                            category,

                                            content,

                                            author:
                                                loggedInUser.name,

                                            authorEmail:
                                                loggedInUser.email,

                                            image

                                        })

                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            if (blogError) {

                                blogError.textContent =
                                    data.message ||
                                    "Unable to create blog.";

                            }

                            return;

                        }


                        alert(
                            "Blog published successfully!"
                        );


                        window.location.href =
                            "dashboard.html";


                    }


                    // =================================================
                    // UPDATE BLOG
                    // =================================================

                    else {

                        const updateData = {

                            title,

                            category,

                            content

                        };


                        if (image) {

                            updateData.image =
                                image;

                        }


                        const response =
                            await fetch(
                                `${API_URL}/blogs/${editBlogId}`,
                                {

                                    method: "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify(
                                            updateData
                                        )

                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            if (blogError) {

                                blogError.textContent =
                                    data.message ||
                                    "Unable to update blog.";

                            }

                            return;

                        }


                        alert(
                            "Blog updated successfully!"
                        );


                        window.location.href =
                            "dashboard.html";

                    }


                } catch (error) {

                    console.error(
                        "Blog Error:",
                        error
                    );


                    if (blogError) {

                        blogError.textContent =
                            "Unable to connect to server.";

                    }

                }

            }
        );

    }

}


// ============================================================
// LOAD BLOG FOR EDIT
// ============================================================

async function loadBlogForEdit(blogId) {

    try {

        const response =
            await fetch(
                `${API_URL}/blogs/${blogId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Blog not found."
            );


            window.location.href =
                "dashboard.html";


            return;

        }


        const blog =
            data.blog;


        const titleInput =
            document.getElementById(
                "blogTitle"
            );


        const categoryInput =
            document.getElementById(
                "blogCategory"
            );


        const contentInput =
            document.getElementById(
                "blogContent"
            );


        if (titleInput) {

            titleInput.value =
                blog.title || "";

        }


        if (categoryInput) {

            categoryInput.value =
                blog.category || "";

        }


        if (contentInput) {

            contentInput.value =
                blog.content || "";

        }


        // Existing image preview

        if (blog.image) {

            const preview =
                document.getElementById(
                    "imagePreview"
                );


            const container =
                document.getElementById(
                    "imagePreviewContainer"
                );


            if (
                preview &&
                container
            ) {

                preview.src =
                    blog.image;


                container.classList.remove(
                    "hidden"
                );


                container.style.display =
                    "block";

            }

        }


    } catch (error) {

        console.error(
            "Load Edit Blog Error:",
            error
        );

    }

}


// ============================================================
// DASHBOARD - LOAD BLOGS FROM MONGODB
// ============================================================

const dashboardBlogList =
    document.getElementById(
        "dashboardBlogList"
    );


if (dashboardBlogList) {

    loadDashboardBlogs();

}


async function loadDashboardBlogs() {

    const loggedInUser =
        getLoggedInUser();


    if (!loggedInUser) {

        redirectToLogin();

        return;

    }


    try {

        // ====================================================
        // GET BLOGS
        // ====================================================

        const response =
            await fetch(
                `${API_URL}/blogs`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load blogs."
            );

        }


        const blogs =
            data.blogs || [];


        // ====================================================
        // FILTER CURRENT USER BLOGS
        // ====================================================

        const userBlogs =
            blogs.filter(
                function (blog) {

                    return (
                        blog.authorEmail ===
                        loggedInUser.email
                    );

                }
            );


        // ====================================================
        // STATISTICS
        // ====================================================

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
                        "published" ||
                        !blog.status
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


        // ====================================================
        // NO BLOGS
        // ====================================================

        if (userBlogs.length === 0) {

            dashboardBlogList.innerHTML = `

                <div
                    class="col-span-full
                           bg-white
                           rounded-3xl
                           border border-gray-100
                           shadow-sm
                           p-12
                           text-center"
                >

                    <div
                        class="w-20 h-20
                               mx-auto
                               mb-5
                               rounded-2xl
                               bg-blue-50
                               flex
                               items-center
                               justify-center"
                    >

                        <span class="text-4xl">
                            📝
                        </span>

                    </div>


                    <h3
                        class="text-2xl
                               font-bold
                               text-gray-900
                               mb-2"
                    >
                        No blogs yet
                    </h3>


                    <p
                        class="text-gray-500
                               mb-6"
                    >
                        Start writing your first blog
                        and share your ideas.
                    </p>


                    <a
                        href="create-blog.html"
                        class="inline-flex
                               items-center
                               gap-2
                               bg-gradient-to-r
                               from-blue-600
                               to-indigo-600
                               text-white
                               px-6 py-3
                               rounded-xl
                               font-semibold
                               shadow-md
                               hover:shadow-xl
                               hover:-translate-y-1
                               transition-all"
                    >
                        Create Your First Blog
                        <span>→</span>
                    </a>

                </div>

            `;

            return;

        }


        // ====================================================
        // DISPLAY USER BLOGS
        // ====================================================

        dashboardBlogList.innerHTML = "";


        userBlogs.forEach(
            function (blog) {

                const blogElement =
                    document.createElement(
                        "article"
                    );


                blogElement.className =
                    "group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300";


                const blogId =
                    blog._id ||
                    blog.id;


                blogElement.innerHTML = `

                    ${
                        blog.image
                            ?

                            `
                                <div class="h-52 overflow-hidden">

                                    <img
                                        src="${blog.image}"
                                        alt="${escapeHTML(blog.title)}"
                                        class="w-full h-full object-cover
                                               group-hover:scale-105
                                               transition-transform
                                               duration-500"
                                    >

                                </div>
                            `

                            :

                            `
                                <div
                                    class="h-52
                                           bg-gradient-to-br
                                           from-blue-500
                                           via-indigo-500
                                           to-purple-600
                                           flex
                                           items-center
                                           justify-center"
                                >

                                    <span class="text-6xl">
                                        📝
                                    </span>

                                </div>
                            `
                    }


                    <div class="p-6">

                        <div
                            class="flex
                                   items-center
                                   justify-between
                                   gap-3
                                   mb-4"
                        >

                            <span
                                class="inline-flex
                                       px-3 py-1
                                       rounded-full
                                       bg-blue-50
                                       text-blue-600
                                       text-xs
                                       font-bold"
                            >
                                ${escapeHTML(
                                    blog.category ||
                                    "General"
                                )}
                            </span>


                            <span
                                class="
                                    ${
                                        blog.status === "draft"
                                            ? "bg-orange-50 text-orange-600"
                                            : "bg-green-50 text-green-600"
                                    }

                                    px-3 py-1
                                    rounded-full
                                    text-xs
                                    font-semibold
                                "
                            >

                                ${
                                    blog.status === "draft"
                                        ? "Draft"
                                        : "Published"
                                }

                            </span>

                        </div>


                        <h3
                            class="text-xl
                                   font-bold
                                   text-gray-900
                                   mb-3
                                   line-clamp-2
                                   group-hover:text-blue-600
                                   transition-colors"
                        >
                            ${escapeHTML(
                                blog.title
                            )}
                        </h3>


                        <p
                            class="text-gray-500
                                   text-sm
                                   leading-6
                                   line-clamp-3
                                   mb-5"
                        >
                            ${escapeHTML(
                                (
                                    blog.content ||
                                    ""
                                ).substring(
                                    0,
                                    150
                                )
                            )}

                            ${
                                (
                                    blog.content ||
                                    ""
                                ).length > 150
                                    ? "..."
                                    : ""
                            }
                        </p>


                        <div
                            class="text-xs
                                   text-gray-400
                                   mb-5"
                        >
                            ${formatDate(
                                blog.createdAt
                            )}
                        </div>


                        <div
                            class="flex
                                   gap-3
                                   pt-4
                                   border-t
                                   border-gray-100"
                        >

                            <a
                                href="blog.html?id=${blogId}"
                                class="flex-1
                                       text-center
                                       bg-gray-100
                                       text-gray-700
                                       px-4 py-2.5
                                       rounded-lg
                                       font-semibold
                                       text-sm
                                       hover:bg-gray-200
                                       transition"
                            >
                                View
                            </a>


                            <a
                                href="create-blog.html?edit=${blogId}"
                                class="flex-1
                                       text-center
                                       bg-blue-600
                                       text-white
                                       px-4 py-2.5
                                       rounded-lg
                                       font-semibold
                                       text-sm
                                       hover:bg-blue-700
                                       transition"
                            >
                                Edit
                            </a>


                            <button
                                class="delete-blog-btn
                                       bg-red-50
                                       text-red-600
                                       px-4 py-2.5
                                       rounded-lg
                                       font-semibold
                                       text-sm
                                       hover:bg-red-100
                                       transition"
                                data-id="${blogId}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;


                dashboardBlogList.appendChild(
                    blogElement
                );

            }
        );


    } catch (error) {

        console.error(
            "Dashboard Blogs Error:",
            error
        );


        dashboardBlogList.innerHTML = `

            <div
                class="col-span-full
                       bg-white
                       rounded-3xl
                       border border-red-100
                       shadow-sm
                       p-12
                       text-center"
            >

                <div class="text-5xl mb-4">
                    🔌
                </div>


                <h3
                    class="text-xl
                           font-bold
                           text-gray-900
                           mb-2"
                >
                    Unable to load your blogs
                </h3>


                <p
                    class="text-gray-500
                           mb-5"
                >
                    Please make sure your backend
                    server is running.
                </p>


                <button
                    onclick="loadDashboardBlogs()"
                    class="bg-blue-600
                           text-white
                           px-6 py-3
                           rounded-xl
                           font-semibold
                           hover:bg-blue-700"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ============================================================
// DELETE BLOG
// ============================================================

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest(
                ".delete-blog-btn"
            );


        if (!button) {

            return;

        }


        const blogId =
            button.dataset.id;


        if (!blogId) {

            alert(
                "Blog ID missing."
            );

            return;

        }


        const confirmDelete =
            confirm(
                "Are you sure you want to delete this blog?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            button.disabled = true;


            button.textContent =
                "Deleting...";


            const response =
                await fetch(
                    `${API_URL}/blogs/${blogId}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to delete blog."
                );

            }


            alert(
                "Blog deleted successfully!"
            );


            loadDashboardBlogs();


        } catch (error) {

            console.error(
                "Delete Blog Error:",
                error
            );


            alert(
                error.message ||
                "Unable to delete blog."
            );


            button.disabled = false;


            button.textContent =
                "Delete";

        }

    }
);


// ============================================================
// HOME PAGE
// MONGODB + SEARCH + CATEGORY FILTER
// ============================================================

const homeBlogContainer =
    document.getElementById(
        "homeBlogContainer"
    );


const blogSearch =
    document.getElementById(
        "blogSearch"
    );


const blogCategoryFilter =
    document.getElementById(
        "blogCategoryFilter"
    );


let allHomeBlogs = [];


// ============================================================
// LOAD HOME BLOGS
// ============================================================

if (homeBlogContainer) {

    loadHomeBlogs();

}


// ============================================================
// LOAD BLOGS FROM MONGODB
// ============================================================

async function loadHomeBlogs() {

    try {

        // Loading state

        homeBlogContainer.innerHTML = `

            <div
                class="col-span-full
                       py-16
                       text-center"
            >

                <div
                    class="w-14 h-14
                           mx-auto
                           mb-4
                           border-4
                           border-blue-200
                           border-t-blue-600
                           rounded-full
                           animate-spin"
                ></div>


                <p class="text-slate-500 font-medium">
                    Loading latest stories...
                </p>

            </div>

        `;


        const response =
            await fetch(
                `${API_URL}/blogs`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load blogs."
            );

        }


        allHomeBlogs =
            data.blogs || [];


        // Display blogs

        displayHomeBlogs(
            allHomeBlogs
        );


    } catch (error) {

        console.error(
            "Home Blogs Error:",
            error
        );


        homeBlogContainer.innerHTML = `

            <div
                class="col-span-full
                       bg-white
                       rounded-3xl
                       border border-red-100
                       shadow-sm
                       p-12
                       text-center"
            >

                <div class="text-5xl mb-4">
                    🔌
                </div>


                <h3
                    class="text-xl
                           font-bold
                           text-gray-900
                           mb-2"
                >
                    Server connection failed
                </h3>


                <p
                    class="text-gray-500
                           mb-2"
                >
                    Please make sure the backend
                    server is running on port 5000.
                </p>


                <p
                    class="text-sm
                           text-red-400
                           mb-6"
                >
                    ${escapeHTML(
                        error.message
                    )}
                </p>


                <button
                    onclick="loadHomeBlogs()"
                    class="bg-blue-600
                           text-white
                           px-6 py-3
                           rounded-xl
                           font-semibold
                           hover:bg-blue-700
                           transition"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ============================================================
// DISPLAY HOME BLOGS
// ============================================================

function displayHomeBlogs(blogs) {

    // No matching blogs

    if (!blogs || blogs.length === 0) {

        homeBlogContainer.innerHTML = `

            <div
                class="col-span-full
                       bg-white
                       rounded-3xl
                       border border-gray-100
                       shadow-sm
                       p-12
                       text-center"
            >

                <div
                    class="w-20 h-20
                           mx-auto
                           mb-5
                           rounded-2xl
                           bg-blue-50
                           flex
                           items-center
                           justify-center"
                >

                    <span class="text-4xl">
                        🔍
                    </span>

                </div>


                <h3
                    class="text-2xl
                           font-bold
                           text-gray-900
                           mb-2"
                >
                    No blogs found
                </h3>


                <p
                    class="text-gray-500
                           mb-6"
                >
                    Try a different search or category.
                </p>


                <button
                    id="clearBlogFilters"
                    class="inline-flex
                           items-center
                           gap-2
                           bg-blue-600
                           text-white
                           px-6 py-3
                           rounded-xl
                           font-semibold
                           hover:bg-blue-700
                           transition"
                >
                    Clear Filters
                </button>

            </div>

        `;


        const clearButton =
            document.getElementById(
                "clearBlogFilters"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function () {

                    if (blogSearch) {

                        blogSearch.value = "";

                    }


                    if (blogCategoryFilter) {

                        blogCategoryFilter.value =
                            "all";

                    }


                    displayHomeBlogs(
                        allHomeBlogs
                    );

                }
            );

        }


        return;

    }


    // Clear existing blogs

    homeBlogContainer.innerHTML = "";


    // Create cards

    blogs.forEach(
        function (blog) {

            const blogCard =
                document.createElement(
                    "article"
                );


            const blogId =
                blog._id ||
                blog.id;


            blogCard.className =
                "group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300";


            blogCard.innerHTML = `

                ${
                    blog.image

                        ?

                        `
                            <div
                                class="h-56
                                       overflow-hidden"
                            >

                                <img
                                    src="${blog.image}"
                                    alt="${escapeHTML(
                                        blog.title
                                    )}"
                                    class="w-full
                                           h-full
                                           object-cover
                                           group-hover:scale-105
                                           transition-transform
                                           duration-500"
                                >

                            </div>
                        `

                        :

                        `
                            <div
                                class="h-56
                                       bg-gradient-to-br
                                       from-blue-500
                                       via-indigo-500
                                       to-purple-600
                                       flex
                                       items-center
                                       justify-center"
                            >

                                <span
                                    class="text-6xl"
                                >
                                    📝
                                </span>

                            </div>
                        `
                }


                <div class="p-6">


                    <!-- CATEGORY -->

                    <span
                        class="inline-flex
                               px-3 py-1
                               rounded-full
                               bg-blue-50
                               text-blue-600
                               text-xs
                               font-bold
                               uppercase"
                    >

                        ${escapeHTML(
                            blog.category ||
                            "General"
                        )}

                    </span>


                    <!-- TITLE -->

                    <h3
                        class="text-xl
                               font-bold
                               text-gray-900
                               mt-4
                               mb-3
                               line-clamp-2
                               group-hover:text-blue-600
                               transition-colors"
                    >

                        ${escapeHTML(
                            blog.title ||
                            "Untitled Blog"
                        )}

                    </h3>


                    <!-- CONTENT -->

                    <p
                        class="text-gray-500
                               text-sm
                               leading-6
                               line-clamp-3
                               mb-5"
                    >

                        ${escapeHTML(
                            (
                                blog.content ||
                                ""
                            ).substring(
                                0,
                                140
                            )
                        )}

                        ${
                            (
                                blog.content ||
                                ""
                            ).length > 140
                                ? "..."
                                : ""
                        }

                    </p>


                    <!-- AUTHOR + READ MORE -->

                    <div
                        class="flex
                               items-center
                               justify-between
                               gap-3
                               pt-4
                               border-t
                               border-gray-100"
                    >

                        <div
                            class="text-sm
                                   text-gray-500
                                   truncate"
                        >

                            By

                            <span
                                class="font-semibold
                                       text-gray-700"
                            >

                                ${escapeHTML(
                                    blog.author ||
                                    "Unknown"
                                )}

                            </span>

                        </div>


                        <a
                            href="blog.html?id=${blogId}"
                            class="shrink-0
                                   inline-flex
                                   items-center
                                   gap-1
                                   text-blue-600
                                   font-semibold
                                   text-sm
                                   hover:text-indigo-600
                                   hover:gap-2
                                   transition-all"
                        >

                            Read More

                            <span>
                                →
                            </span>

                        </a>

                    </div>


                    <!-- DATE -->

                    <div
                        class="text-xs
                               text-slate-400
                               mt-4"
                    >

                        ${formatDate(
                            blog.createdAt
                        )}

                    </div>


                </div>

            `;


            homeBlogContainer.appendChild(
                blogCard
            );

        }
    );

}


// ============================================================
// FILTER BLOGS
// SEARCH + CATEGORY
// ============================================================

function filterHomeBlogs() {

    const searchText =
        blogSearch
            ? blogSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedCategory =
        blogCategoryFilter
            ? blogCategoryFilter.value
            : "all";


    const filteredBlogs =
        allHomeBlogs.filter(
            function (blog) {

                const title =
                    (
                        blog.title ||
                        ""
                    ).toLowerCase();


                const content =
                    (
                        blog.content ||
                        ""
                    ).toLowerCase();


                const category =
                    (
                        blog.category ||
                        ""
                    ).toLowerCase();


                // Search title + content + category

                const matchesSearch =
                    !searchText ||

                    title.includes(
                        searchText
                    ) ||

                    content.includes(
                        searchText
                    ) ||

                    category.includes(
                        searchText
                    );


                // Category filter

                const matchesCategory =
                    selectedCategory ===
                        "all" ||

                    (
                        blog.category ||
                        ""
                    ) === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    displayHomeBlogs(
        filteredBlogs
    );

}


// ============================================================
// SEARCH EVENT
// ============================================================

if (blogSearch) {

    blogSearch.addEventListener(
        "input",
        filterHomeBlogs
    );

}


// ============================================================
// CATEGORY EVENT
// ============================================================

if (blogCategoryFilter) {

    blogCategoryFilter.addEventListener(
        "change",
        filterHomeBlogs
    );

}


// ============================================================
// BLOG DETAILS
// ============================================================

const blogDetails =
    document.getElementById(
        "blogDetails"
    );


if (blogDetails) {

    loadBlogDetails();

}


async function loadBlogDetails() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const blogId =
            params.get("id");


        if (!blogId) {

            throw new Error(
                "Blog ID missing."
            );

        }


        const response =
            await fetch(
                `${API_URL}/blogs/${blogId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            blogDetails.innerHTML = `

                <div
                    class="p-12
                           text-center"
                >

                    <div class="text-5xl mb-4">
                        😕
                    </div>


                    <h3
                        class="text-2xl
                               font-bold
                               text-gray-900
                               mb-2"
                    >
                        Blog not found
                    </h3>


                    <p
                        class="text-gray-500
                               mb-6"
                    >
                        ${escapeHTML(
                            data.message ||
                            "This blog does not exist."
                        )}
                    </p>


                    <a
                        href="index.html"
                        class="inline-flex
                               items-center
                               gap-2
                               bg-blue-600
                               text-white
                               px-6 py-3
                               rounded-xl
                               font-semibold
                               hover:bg-blue-700"
                    >
                        ← Back to Home
                    </a>

                </div>

            `;

            return;

        }


        const blog =
            data.blog;


        blogDetails.innerHTML = `

            ${
                blog.image

                    ?

                    `
                        <div
                            class="h-72
                                   md:h-[450px]
                                   overflow-hidden"
                        >

                            <img
                                src="${blog.image}"
                                alt="${escapeHTML(
                                    blog.title
                                )}"
                                class="w-full
                                       h-full
                                       object-cover"
                            >

                        </div>
                    `

                    :

                    `
                        <div
                            class="h-64
                                   md:h-80
                                   bg-gradient-to-br
                                   from-blue-500
                                   via-indigo-500
                                   to-purple-600
                                   flex
                                   items-center
                                   justify-center"
                        >

                            <span class="text-7xl">
                                📝
                            </span>

                        </div>
                    `
            }


            <div
                class="p-7
                       md:p-10"
            >


                <!-- CATEGORY -->

                <span
                    class="inline-flex
                           px-4 py-1.5
                           rounded-full
                           bg-blue-50
                           text-blue-600
                           text-sm
                           font-bold"
                >

                    ${escapeHTML(
                        blog.category ||
                        "General"
                    )}

                </span>


                <!-- TITLE -->

                <h1
                    class="text-3xl
                           md:text-5xl
                           font-extrabold
                           text-gray-900
                           leading-tight
                           mt-5
                           mb-6"
                >

                    ${escapeHTML(
                        blog.title
                    )}

                </h1>


                <!-- AUTHOR -->

                <div
                    class="flex
                           items-center
                           gap-3
                           text-sm
                           text-gray-500
                           pb-7
                           border-b
                           border-gray-100"
                >

                    <div
                        class="w-11 h-11
                               rounded-full
                               bg-blue-100
                               flex
                               items-center
                               justify-center"
                    >
                        👤
                    </div>


                    <div>

                        <p>

                            Written by

                            <strong
                                class="text-gray-800"
                            >

                                ${escapeHTML(
                                    blog.author ||
                                    "Unknown"
                                )}

                            </strong>

                        </p>


                        <p
                            class="text-xs
                                   text-gray-400
                                   mt-1"
                        >

                            ${formatDate(
                                blog.createdAt
                            )}

                        </p>

                    </div>

                </div>


                <!-- CONTENT -->

                <div
                    class="mt-8
                           text-gray-700
                           text-lg
                           leading-8
                           whitespace-pre-line"
                >

                    ${escapeHTML(
                        blog.content ||
                        ""
                    )}

                </div>


                <!-- BACK -->

                <div
                    class="border-t
                           border-gray-100
                           mt-10
                           pt-7"
                >

                    <a
                        href="index.html"
                        class="inline-flex
                               items-center
                               gap-2
                               text-blue-600
                               font-semibold
                               hover:text-indigo-600
                               hover:gap-3
                               transition-all"
                    >

                        ← Back to Home

                    </a>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(
            "Blog Details Error:",
            error
        );


        blogDetails.innerHTML = `

            <div
                class="p-12
                       text-center"
            >

                <div class="text-5xl mb-4">
                    🔌
                </div>


                <h3
                    class="text-xl
                           font-bold
                           text-gray-900
                           mb-2"
                >
                    Server connection failed
                </h3>


                <p
                    class="text-gray-500
                           mb-6"
                >
                    Please make sure your backend
                    server is running.
                </p>


                <a
                    href="index.html"
                    class="inline-flex
                           items-center
                           gap-2
                           bg-blue-600
                           text-white
                           px-6 py-3
                           rounded-xl
                           font-semibold
                           hover:bg-blue-700"
                >
                    ← Back to Home
                </a>

            </div>

        `;

    }

}


// ============================================================
// IMAGE PREVIEW
// ============================================================

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


                imagePreviewContainer.classList.add(
                    "hidden"
                );


                return;

            }


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


                    imagePreviewContainer.classList.remove(
                        "hidden"
                    );


                    imagePreviewContainer.style.display =
                        "block";

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ============================================================
// IMAGE TO BASE64
// ============================================================

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


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {

    if (!date) {

        return "Recently";

    }


    try {

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {

                day: "numeric",

                month: "short",

                year: "numeric"

            }
        );

    } catch (error) {

        return date;

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}


// ============================================================
// END OF SCRIPT
// ============================================================