# MERN Bookstore

A comprehensive full-stack e-commerce application for selling books, built with the MERN stack (MongoDB, Express, React, Node.js). This project features a robust backend API, a responsive frontend user interface, and an admin dashboard for managing the bookstore.

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) and OAuth (Google/GitHub).
- **Product Management**: Browse, search, and filter books by categories, authors, and publishers.
- **Shopping Cart & Checkout**: Seamless cart management and secure checkout process (integrated with Stripe).
- **Order Management**: Users can track orders; Admins can manage order statuses.
- **Admin Dashboard**: Comprehensive analytics, user management, product management (Books, Authors, Categories, Publishers), and staff management.
- **Reviews & Ratings**: Users can review and rate books.
- **Image Uploads**: Cloudinary integration for efficient image storage and delivery.
- **Responsive Design**: Built with React Bootstrap and Material UI for a mobile-friendly experience.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: Passport.js, JWT
- **File Storage**: Cloudinary, Multer
- **Payment**: Stripe

### Frontend
- **Library**: React.js
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Frameworks**: React Bootstrap, Material UI (@mui/material)
- **HTTP Client**: Axios
- **Charts**: Recharts

## 📂 Project Structure

```
mern-bookstore/
├── backend/         # Node.js/Express backend API
│   ├── config/      # Database and 3rd party configs
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   └── ...
├── frontend/        # React frontend application
│   ├── public/      # Static assets
│   ├── src/         # React source code
│   └── ...
└── README.md        # Project documentation
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)
- Cloudinary Account (for image uploads)
- Stripe Account (for payments)
- Google/GitHub OAuth Credentials (optional)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mikiasDev/Book-Shop.git
    cd mern-bookstore
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend Environment Variables**
    Create a `.env` file in the `backend/` directory and add the following:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development
    FRONTEND_URL=http://localhost:3000

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Stripe
    STRIPE_SECRET_KEY=your_stripe_secret_key

    # OAuth (Optional)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

2.  **Frontend Configuration**
    The frontend is configured to proxy requests to `http://localhost:5000` in `package.json`. Ensure your backend port matches or update the proxy.

### Running the Application

To run both the backend and frontend concurrently (development mode):

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Run the dev script:
    ```bash
    npm run dev
    ```
    This will start the backend server on port 5001 and the frontend development server on port 3000.

## 📄 License

This project is licensed under the MIT License.
