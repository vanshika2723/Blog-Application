
// ===============================
// REGISTER FUNCTIONALITY
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document
            .getElementById("name")
            .value
            .trim();

        const email = document
            .getElementById("registerEmail")
            .value
            .trim();

        const password = document
            .getElementById("registerPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        const registerError =
            document.getElementById("registerError");

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

        // Get existing users
        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        // Check existing email
        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            registerError.textContent =
                "An account with this email already exists.";

            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password
        };

        // Save user
        users.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Registration successful!");

        // Redirect to login
        window.location.href = "login.html";
    });
}


// ===============================
// LOGIN FUNCTIONALITY
// ===============================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        const loginError =
            document.getElementById("loginError");

        loginError.textContent = "";

        // Get registered users
        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        // Find matching user
        const user = users.find(
            user =>
                user.email === email &&
                user.password === password
        );

        // Invalid login
        if (!user) {
            loginError.textContent =
                "Invalid email or password.";

            return;
        }

        // Save logged-in user
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );

        // Redirect to dashboard
        window.location.href =
            "dashboard.html";
    });
}


// ===============================
// DASHBOARD
// ===============================

const welcomeMessage =
    document.getElementById("welcomeMessage");

if (welcomeMessage) {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    // User not logged in
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
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            // Remove logged-in user
            localStorage.removeItem(
                "loggedInUser"
            );

            // Go to login
            window.location.href =
                "login.html";
        }
    );
}


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

        // Get existing blogs
        let blogs =
            JSON.parse(
                localStorage.getItem("blogs")
            ) || [];


        // =========================
        // EDIT MODE
        // =========================

        if (editBlogId) {

            const blog =
                blogs.find(
                    blog =>
                        blog.id ===
                            Number(editBlogId) &&
                        blog.authorEmail ===
                            loggedInUser.email
                );


            if (!blog) {

                alert("Blog not found.");

                window.location.href =
                    "dashboard.html";

            } else {

                // Fill existing values

                document.getElementById(
                    "blogTitle"
                ).value = blog.title;

                document.getElementById(
                    "blogCategory"
                ).value = blog.category;

                document.getElementById(
                    "blogContent"
                ).value = blog.content;


                // Change button text

                if (blogSubmitButton) {
                    blogSubmitButton.textContent =
                        "Update Blog";
                }


                // Show existing image

                if (blog.image) {

                    const imagePreview =
                        document.getElementById(
                            "imagePreview"
                        );

                    const imagePreviewContainer =
                        document.getElementById(
                            "imagePreviewContainer"
                        );


                    if (
                        imagePreview &&
                        imagePreviewContainer
                    ) {

                        imagePreview.src =
                            blog.image;

                        imagePreviewContainer.classList.remove(
                            "hidden"
                        );

                        imagePreviewContainer.style.display =
                            "block";
                    }
                }
            }
        }


        // =========================
        // SUBMIT FORM
        // =========================

        blogForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // Get values

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


                const imageInput =
                    document.getElementById(
                        "blogImage"
                    );


                const imageFile =
                    imageInput
                        ? imageInput.files[0]
                        : null;


                const blogError =
                    document.getElementById(
                        "blogError"
                    );


                blogError.textContent = "";


                // =========================
                // VALIDATION
                // =========================

                if (
                    !title ||
                    !category ||
                    !content
                ) {

                    blogError.textContent =
                        "Please fill all required fields.";

                    return;
                }


                // =========================
                // IMAGE DATA
                // =========================

                let imageData = "";


                // New image selected

                if (imageFile) {

                    try {

                        imageData =
                            await convertImageToBase64(
                                imageFile
                            );

                    } catch (error) {

                        console.error(
                            error
                        );

                        blogError.textContent =
                            "Unable to process image.";

                        return;
                    }

                }


                // Editing without new image

                else if (editBlogId) {

                    const existingBlog =
                        blogs.find(
                            blog =>
                                blog.id ===
                                    Number(
                                        editBlogId
                                    ) &&
                                blog.authorEmail ===
                                    loggedInUser.email
                        );


                    if (existingBlog) {

                        imageData =
                            existingBlog.image ||
                            "";
                    }
                }


                // =========================
                // UPDATE EXISTING BLOG
                // =========================

                if (editBlogId) {

                    const blogIndex =
                        blogs.findIndex(
                            blog =>
                                blog.id ===
                                    Number(
                                        editBlogId
                                    ) &&
                                blog.authorEmail ===
                                    loggedInUser.email
                        );


                    if (blogIndex === -1) {

                        blogError.textContent =
                            "Blog not found.";

                        return;
                    }


                    blogs[blogIndex].title =
                        title;

                    blogs[blogIndex].category =
                        category;

                    blogs[blogIndex].content =
                        content;

                    blogs[blogIndex].image =
                        imageData;


                    localStorage.setItem(
                        "blogs",
                        JSON.stringify(blogs)
                    );


                    alert(
                        "Blog updated successfully!"
                    );
                }


                // =========================
                // CREATE NEW BLOG
                // =========================

                else {

                    const newBlog = {

                        id: Date.now(),

                        title: title,

                        category: category,

                        content: content,

                        image: imageData,

                        author:
                            loggedInUser.name,

                        authorEmail:
                            loggedInUser.email,

                        createdAt:
                            new Date()
                                .toLocaleDateString(),

                        status:
                            "published"
                    };


                    blogs.push(newBlog);


                    localStorage.setItem(
                        "blogs",
                        JSON.stringify(blogs)
                    );


                    alert(
                        "Blog published successfully!"
                    );
                }


                // Back to dashboard

                window.location.href =
                    "dashboard.html";
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
            localStorage.getItem("blogs")
        ) || [];


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

        // User's blogs

        const userBlogs =
            blogs.filter(
                blog =>
                    blog.authorEmail ===
                    loggedInUser.email
            );


        // =========================
        // STATISTICS
        // =========================

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


        // =========================
        // NO BLOGS
        // =========================

        if (userBlogs.length === 0) {

            dashboardBlogList.innerHTML = `

                <div
                    class="col-span-full
                           text-center
                           bg-white
                           rounded-2xl
                           p-10
                           shadow-sm
                           border
                           border-gray-100"
                >

                    <div
                        class="text-5xl mb-4"
                    >
                        📝
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
                        Start writing your
                        first blog.
                    </p>

                    <a
                        href="create-blog.html"
                        class="inline-block
                               bg-blue-600
                               text-white
                               px-6 py-3
                               rounded-lg
                               font-semibold
                               hover:bg-blue-700
                               transition"
                    >
                        Create Your First Blog
                    </a>

                </div>

            `;
        }


        // =========================
        // DISPLAY BLOGS
        // =========================

        else {

            dashboardBlogList.innerHTML =
                "";


            userBlogs.forEach(
                function (blog) {

                    const blogElement =
                        document.createElement(
                            "article"
                        );


                    blogElement.className =
                        `bg-white
                         rounded-2xl
                         overflow-hidden
                         shadow-sm
                         border
                         border-gray-100
                         hover:shadow-lg
                         hover:-translate-y-1
                         transition
                         duration-300`;


                    blogElement.innerHTML = `

                        ${
                            blog.image
                                ? `
                                    <img
                                        src="${blog.image}"
                                        alt="${blog.title}"
                                        class="w-full
                                               h-52
                                               object-cover"
                                    >
                                  `
                                : `
                                    <div
                                        class="w-full
                                               h-52
                                               bg-gradient-to-r
                                               from-blue-500
                                               to-indigo-600
                                               flex
                                               items-center
                                               justify-center
                                               text-white
                                               text-5xl"
                                    >
                                        📝
                                    </div>
                                  `
                        }


                        <div
                            class="p-6"
                        >

                            <span
                                class="inline-block
                                       bg-blue-100
                                       text-blue-700
                                       text-xs
                                       font-semibold
                                       px-3 py-1
                                       rounded-full
                                       mb-3"
                            >
                                ${blog.category}
                            </span>


                            <h3
                                class="text-xl
                                       font-bold
                                       text-gray-900
                                       mb-3"
                            >
                                ${blog.title}
                            </h3>


                            <p
                                class="text-gray-600
                                       leading-7
                                       mb-4"
                            >
                                ${blog.content.substring(
                                    0,
                                    150
                                )}
                                ${
                                    blog.content.length >
                                    150
                                        ? "..."
                                        : ""
                                }
                            </p>


                            <p
                                class="text-sm
                                       text-gray-400
                                       mb-5"
                            >
                                Published on
                                ${blog.createdAt}
                            </p>


                            <div
                                class="flex
                                       items-center
                                       gap-3"
                            >

                                <a
                                    href="create-blog.html?edit=${blog.id}"
                                    class="flex-1
                                           text-center
                                           bg-blue-50
                                           text-blue-600
                                           py-2
                                           rounded-lg
                                           font-semibold
                                           hover:bg-blue-100
                                           transition"
                                >
                                    Edit
                                </a>


                                <button
                                    class="delete-blog-btn
                                           flex-1
                                           bg-red-50
                                           text-red-600
                                           py-2
                                           rounded-lg
                                           font-semibold
                                           hover:bg-red-100
                                           transition"
                                    data-id="${blog.id}"
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
        }
    }
}


// ===============================
// DELETE BLOG
// ===============================

document.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-blog-btn"
            );


        if (!deleteButton) {
            return;
        }


        const blogId =
            Number(
                deleteButton.dataset.id
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
                localStorage.getItem("blogs")
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
            localStorage.getItem("blogs")
        ) || [];


    // Only published blogs

    const publishedBlogs =
        blogs.filter(
            blog =>
                blog.status ===
                "published"
        );


    // =========================
    // NO BLOGS
    // =========================

    if (publishedBlogs.length === 0) {

        homeBlogContainer.innerHTML = `

            <div
                class="col-span-full
                       text-center
                       bg-white
                       rounded-2xl
                       p-10
                       shadow-sm
                       border
                       border-gray-100"
            >

                <div
                    class="text-5xl mb-4"
                >
                    📝
                </div>

                <h3
                    class="text-2xl
                           font-bold
                           text-gray-900
                           mb-2"
                >
                    No blogs available
                </h3>

                <p
                    class="text-gray-500
                           mb-6"
                >
                    Be the first one to
                    publish a blog!
                </p>

                <a
                    href="create-blog.html"
                    class="inline-block
                           bg-blue-600
                           text-white
                           px-6 py-3
                           rounded-lg
                           font-semibold
                           hover:bg-blue-700
                           transition"
                >
                    Create Blog
                </a>

            </div>

        `;
    }


    // =========================
    // DISPLAY BLOGS
    // =========================

    else {

        homeBlogContainer.innerHTML =
            "";


        // Latest blogs first

        const latestBlogs =
            [...publishedBlogs]
                .reverse();


        latestBlogs.forEach(
            function (blog) {

                const blogCard =
                    document.createElement(
                        "article"
                    );


                blogCard.className =
                    `bg-white
                     rounded-2xl
                     overflow-hidden
                     shadow-sm
                     border
                     border-gray-100
                     hover:shadow-xl
                     hover:-translate-y-1
                     transition
                     duration-300`;


                blogCard.innerHTML = `

                    ${
                        blog.image
                            ? `
                                <img
                                    src="${blog.image}"
                                    alt="${blog.title}"
                                    class="w-full
                                           h-56
                                           object-cover"
                                >
                              `
                            : `
                                <div
                                    class="w-full
                                           h-56
                                           bg-gradient-to-r
                                           from-blue-500
                                           to-indigo-600
                                           flex
                                           items-center
                                           justify-center
                                           text-white
                                           text-5xl"
                                >
                                    📝
                                </div>
                              `
                    }


                    <div
                        class="p-6"
                    >

                        <span
                            class="inline-block
                                   bg-blue-100
                                   text-blue-700
                                   text-xs
                                   font-semibold
                                   px-3 py-1
                                   rounded-full
                                   mb-3"
                        >
                            ${blog.category}
                        </span>


                        <h3
                            class="text-xl
                                   font-bold
                                   text-gray-900
                                   mb-3"
                        >
                            ${blog.title}
                        </h3>


                        <p
                            class="text-gray-600
                                   leading-7
                                   mb-4"
                        >
                            ${blog.content.substring(
                                0,
                                120
                            )}
                            ${
                                blog.content.length >
                                120
                                    ? "..."
                                    : ""
                            }
                        </p>


                        <div
                            class="flex
                                   items-center
                                   justify-between
                                   text-sm
                                   text-gray-400
                                   mb-5"
                        >

                            <span>
                                By ${blog.author}
                            </span>

                            <span>
                                ${blog.createdAt}
                            </span>

                        </div>


                        <a
                            href="blog.html?id=${blog.id}"
                            class="inline-block
                                   w-full
                                   text-center
                                   bg-blue-600
                                   text-white
                                   py-2.5
                                   rounded-lg
                                   font-semibold
                                   hover:bg-blue-700
                                   transition"
                        >
                            Read More
                        </a>

                    </div>

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
            localStorage.getItem("blogs")
        ) || [];


    const blog =
        blogs.find(
            blog =>
                blog.id === blogId
        );


    // =========================
    // BLOG NOT FOUND
    // =========================

    if (!blog) {

        blogDetails.innerHTML = `

            <div
                class="text-center
                       py-12"
            >

                <div
                    class="text-6xl mb-5"
                >
                    😕
                </div>

                <h3
                    class="text-2xl
                           font-bold
                           text-gray-900
                           mb-3"
                >
                    Blog not found
                </h3>

                <p
                    class="text-gray-500
                           mb-6"
                >
                    The blog you are looking
                    for does not exist.
                </p>

                <a
                    href="index.html"
                    class="inline-block
                           bg-blue-600
                           text-white
                           px-6 py-3
                           rounded-lg
                           font-semibold
                           hover:bg-blue-700
                           transition"
                >
                    ← Back to Home
                </a>

            </div>

        `;
    }


    // =========================
    // DISPLAY BLOG
    // =========================

    else {

        blogDetails.innerHTML = `

            ${
                blog.image
                    ? `
                        <img
                            src="${blog.image}"
                            alt="${blog.title}"
                            class="w-full
                                   h-64
                                   md:h-96
                                   object-cover
                                   rounded-2xl
                                   mb-8"
                        >
                      `
                    : ""
            }


            <span
                class="inline-block
                       bg-blue-100
                       text-blue-700
                       text-sm
                       font-semibold
                       px-3 py-1
                       rounded-full
                       mb-4"
            >
                ${blog.category}
            </span>


            <h2
                class="text-3xl
                       md:text-5xl
                       font-bold
                       text-gray-900
                       leading-tight
                       mb-5"
            >
                ${blog.title}
            </h2>


            <div
                class="flex
                       flex-wrap
                       items-center
                       gap-2
                       text-sm
                       text-gray-500
                       border-b
                       border-gray-100
                       pb-6
                       mb-8"
            >

                <span>
                    By
                    <strong
                        class="text-gray-700"
                    >
                        ${blog.author}
                    </strong>
                </span>

                <span>
                    ·
                </span>

                <span>
                    Published on
                    ${blog.createdAt}
                </span>

            </div>


            <div
                class="text-gray-700
                       text-lg
                       leading-8
                       whitespace-pre-line
                       mb-10"
            >
                ${blog.content}
            </div>


            <a
                href="index.html"
                class="inline-flex
                       items-center
                       bg-gray-100
                       text-gray-700
                       px-5 py-3
                       rounded-lg
                       font-semibold
                       hover:bg-gray-200
                       transition"
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


            // No file selected

            if (!file) {

                imagePreview.src = "";

                imagePreviewContainer.classList.add(
                    "hidden"
                );

                imagePreviewContainer.style.display =
                    "none";

                return;
            }


            // Check image type

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


            // FileReader

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

