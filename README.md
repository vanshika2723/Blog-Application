# 📝 Blog Application

A full-stack Blog Application built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

The application allows users to register and login securely using JWT authentication, create and manage their own blogs, and explore blogs with search and category filtering.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-based Authentication
- Password Hashing using bcrypt
- Protected Dashboard
- Logout functionality

### 📝 Blog Management
- Create Blog
- Read/View Blogs
- Update Blog
- Delete Blog
- Upload Blog Images
- Blog Details Page
- User-specific Dashboard

### 🔎 Search & Filtering
- Search blogs by title
- Search blogs by content
- Search blogs by category
- Filter blogs by category

### 🎨 UI
- Modern and responsive interface
- Mobile-friendly design
- Blog cards
- Dashboard statistics
- Image preview
- Loading and error states

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Token)
- bcryptjs

### Tools
- Git
- GitHub
- VS Code

---

## 📂 Project Structure

```text
Blog-Application/
│
├── client/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── create-blog.html
│   ├── blog.html
│   ├── script.js
│   └── ...
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
