# Clean Air Now - Real-Time Air Quality Monitoring

![Clean Air Now Dashboard Screenshot](./readme-screenshot.png)
*(Note: `[YOUR GITHUB REPO LINK]` with the actual URL to your GitHub repository.
4.  Save the file, then commit and push it to GitHub.

Clean Air Now: A Full-Stack MERN GIS Application

Live Application: [**https://clean-air-now.vercel.app/**](https://clean-air-now.vercel.app/)

**Clean You should replace `readme-screenshot.png` with an actual screenshot of your application's dashboard)*

**Clean Air Now** Air Now** is a responsive, full-stack web application designed to empower communities with real-time air quality data and a is a full-stack MERN application designed to empower communities with real-time, accessible, and actionable environmental data. It provides platform for reporting local pollution incidents. Leveraging the MERN stack, WebSockets for real-time communication, and Leaflet for interactive GIS an interactive GIS map to visualize the Air Quality Index (AQI) and allows users to report and view local pollution incidents as mapping, this project provides a centralized hub for environmental awareness and action.

![Clean Air Now Dashboard Screenshot](https://i.imgur.com/example-screenshot.png)
*(**Note:** You should replace this image link with a real they happen.

 🌐 Live Demo

* **Live Frontend (Vercel):** **screenshot of your app. Upload a screenshot to a site like [Imgur](https://imgur.com/upload) and[https://clean-air-now.vercel.app](https://clean-air-now.vercel.app)**
* **Live Backend (Render):** **[https://clean-air-now-server.on paste the link here.)*

## Key Features

* **Interactive GIS Map**: A live, interactiverender.com](<https://clean-air-now-server.onrender.com>)**

## ✨ Key Features

* **Interactive GIS Map:** A dynamic and responsive map built with Leaflet, displaying the user's map powered by Leaflet that displays the user's current location with a custom high-accuracy marker.

**Real-Time Community Reporting**: Users can submit geo-tagged incident reports (e.g., illegal burning). New reports are broadcast live location and community-submitted incident reports.

* **Real-Time AQI Monitoring:** Fetches and displays real-time instantly to all connected users via Socket.IO, appearing on their maps without a page refresh.

* **Instant Air Quality Index data from the OpenWeather API for any point on the map, triggered by a simple click.

* Air Quality Index (AQI)**: Automatically fetches and displays the AQI for the user's location upon login. Users can also click anywhere on the map to get an instant AQI reading for that specific point, powered by the OpenWeather**Live Community Reporting:** Users can submit pollution incident reports with a description and location. New reports are broadcast instantly to all connected clients API.

* **Secure User Authentication**: Complete user management system with registration, login, and a secure "Forgot Password" email using **Socket.IO** without needing a page refresh.

* **Secure User Authentication:** Complete user system with JWT-based authentication for registration, login, and protected routes. Passwords are securely hashed with `bcryptjs`.
* flow. Authentication is handled with JSON Web Tokens (JWT) and hashed passwords (bcrypt).

* **Role-Based Admin Dashboard**: A secure, admin-only dashboard for viewing and managing all user-submitted reports, including the ability to**Role-Based Admin Dashboard:** A secure admin-only panel for viewing all user reports and moderating content by updating update a report's status (e.g., from "Submitted" to "Resolved").
* **Production a report's status (e.g., from "Submitted" to "In Review" or "Resolved").

* **-Ready Backend**: The backend is hardened with rate-limiting to prevent spam/abuse and server-side validation to ensure data integrity.Temporary Report Markers:** Publicly visible incident reports automatically disappear from the map after a configurable duration (e.g.,

---

## Technical Architecture

The application is built on a modern, decoupled architecture, ensuring scalability and maintainability.

* **Frontend:** A dynamic single-page application built with **React (Vite)** and styled with **Tailwind CSS**. De24 hours) to keep the map relevant and uncluttered.

* **Secure Password Reset:** A full-ployed on **Vercel**.

* **Backend:** A robust and secure RESTful API built with **Node.js**featured "Forgot Password" flow that sends users a secure, temporary token via email to allow them to reset their password.

---

## 🛠️ Technology Stack

This project leverages the MERN stack and other modern technologies to create a robust and real and **Express.js**. Deployed on **Render**.

* **Database:** A flexible NoSQL database using **MongoDB-time experience.

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, React**, hosted on **MongoDB Atlas**. |

* **Real-Time Engine:** A persistent WebSocket connection managed by **Socket.IO** for instant, bi-directional communication between the client and server.

---

## Tech Stack

| Category               Router, Tailwind CSS, Axios, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (with Mongoose) |
| **Real-Time**| Socket.IO || Technology                                                     |
| --------------------- | -------------------------------------------------------------- |
| **Frontend**          | React
| **GIS** | Leaflet, React-Leaflet |
| **Authentication** | JSON Web Tokens (JWT, React Router, Tailwind CSS, Axios, Vite, Leaflet        |
| **Backend**           | Node.js), bcrypt.js |
| **Deployment**| Vercel (Frontend), Render (Backend), MongoDB Atlas (DB, Express.js                                            |
| **Database**          | MongoDB (with Mongoose)                                        |
| **) |
| **Email Service** | Nodemailer, Mailtrap (for development) |
| **Security**Real-Time**         | Socket.IO                                                      |
| **Authentication**    | JSON Web Tokens (JWT | `express-rate-limit`, `express-validator` |

---

## 🚀 Getting Started & Local), bcrypt.js                               |

| **Email Service**     | Nodemailer (with Mailtrap for development)                      Setup

To run this project on your local machine, follow these steps.

### Prerequisites

* Node.js (|
| **Deployment**        | Vercel (Frontend), Render (Backend), MongoDB Atlas (DB)        |

---

## Local Development Setup

To run this project on your local machine, follow these steps:

### Prerequisitesv18 or later)

* `pnpm` (or `npm`/`yarn`)
* MongoDB Compass

* Node.js and pnpm installed
* A local MongoDB instance or a MongoDB Atlas account
* (or another tool to view your local database)

* A free [Mailtrap.io](<https://mailtrap.io>   A free [Mailtrap.io](https://mailtrap.io) account for email testing

### 1. Clone) account for testing password reset emails

### Installation & Setup

1. **Clone the repository:**
     the Repository

``````bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/clean-air-now.git
    bash
git clone [YOUR GITHUB REPO LINK]
cd clean-air-now


Server Directory

# Navigate to the server directory
cd server

# Install dependencies
cd clean-air-now
    ```

2.  **Setup the Backend (`/server`):**
    *pnpm install

# Create a .env file in the /server directory and add the following variables:
MONGO_URI   Navigate to the server directory: `cd server`
    *   Install dependencies: `pnpm install`
    *   Create a `.env` file in the `/server` directory and add the following variables:
        ```env=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
OPENWEATHER_API_KEY
        MONGO_URI=mongodb://localhost:27017/clean-air-now
        JWT=<your_openweather_api_key>
FRONTEND_URL=http://localhost:5173_SECRET=YOUR_VERY_SECRET_JWT_STRING
        OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API

# Mailtrap Credentials
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=<your_mailtrap_user>
EMAIL_PASS=<your_mailtrap_pass_KEY
        REPORT_EXPIRATION_HOURS=24
        
        # Mailtrap Credentials
>
EMAIL_FROM="Clean Air Now <noreply@cleanairnow.com>"

# Start the backend        EMAIL_HOST=sandbox.smtp.mailtrap.io
        EMAIL_PORT=2525
         server
pnpm run dev
EMAIL_USER=YOUR_MAILTRAP_USERNAME
        EMAIL_PASS=YOUR_MAILTRAP_PASSWORD
        EMAIL```

### 3. Frontend Setup

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
pnpm install

# The frontend will automatically connect to the backend_FROM="Clean Air Now <noreply@cleanairnow.com>"
        
        # For local development at http://localhost:5000
# (as defined in client/src/apiConfig.js)
        FRONTEND_URL=http://localhost:5173
        ```
    *   Start the backend server:

# Start the frontend development server
pnpm run dev



## 🌐 Live Demo

*   **Live Frontend (Vercel):** **[https://clean-air-now.vercel.app](https://clean-air-now.vercel.app)**
    *(This is the main application link for users.)*

*   **Live Backend (Render):** **[https://clean-air-now-server.onrender.com](https://clean-air-now-server.onrender.com)**
    *(Note: This is the URL for the backend API. Visiting it directly in a browser will show a "Cannot GET /" message, which is expected behavior.)*
