# 🚀 Backend for Networking Technologies Learning Platform

This repository contains the **backend** for a web platform dedicated to learning networking technologies. The platform provides an interactive environment for students to complete network-related labs, track their progress, and learn theoretical concepts. Users can register and log in securely, access different network labs, track their progress, and perform hands-on networking simulations with tools such as **FRRouting** or **GNS3**. The backend exposes a RESTful API for managing users, labs, and progress data.

The platform includes features such as user authentication, lab management, progress tracking, networking simulations, and a RESTful API.
The backend is built with Node.js and Express, stores data in MongoDB, uses JWT for authentication, and leverages Docker for running network simulations. Nginx is used as a reverse proxy with HTTPS via Certbot for deployment, and PM2 manages production processes.

🌐 **Live Demo:**
👉 [Learn Network Technologies from Beginner to Professional](https://aist-frontend-73ux0flrc-alisagafarovas-projects.vercel.app/)

---

## 🌟 Features

- User Authentication – Secure login and registration system.
- Lab Management – Access different network labs and track progress.
- Progress Tracking – Monitor completion of labs and activities.
- Networking Simulations – Hands-on learning with FRRouting or GNS3.
- RESTful API – Endpoints to manage users, labs, and progress data.

---

## 🌐 Live Demo

See the platform in action: [Live Demo](https://aist-alisagafarovas-projects.vercel.app/)

---

## 🛠 Tech Stack

- Node.js – JavaScript runtime for backend development.
- Express – Web framework.
- MongoDB – Database for users and labs.
- JWT – JSON Web Tokens for authentication.
- Docker – Containerization for network simulations.
- Nginx / Certbot – Reverse proxy and HTTPS for deployment.
- PM2 – Process manager for production.

---

## ⚡ Installation and Setup

To get started, clone the repository and navigate into it. Then install dependencies, create a `.env` file with your MongoDB URI, port, and JWT secret, and start the server in development mode. For production, use PM2 to run the backend.

To deploy on a server, install Nginx and Certbot, configure Nginx as a reverse proxy, enable the site, restart Nginx, and set up HTTPS using Certbot. Docker can be used to pull and run FRRouting containers for network simulations. The backend connects to FRRouting for interactive lab exercises, each running in an isolated session per user.

---

## 📡 API Endpoints

- POST /api/user/register – Register a new user
- POST /api/user/login – Authenticate user
- GET /api/user/me – Get current user info
- POST /api/progress/save – Save lab progress
- POST /api/progress/update – Update progress and context

---

## 🤝 Contributing

Feel free to open issues or submit pull requests. Follow coding conventions and test changes before committing.

---

## 📝 License

MIT License
