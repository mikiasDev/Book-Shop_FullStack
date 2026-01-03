# Bookstore Backend API

The backend for the MERN Bookstore application, built with Node.js, Express, and MongoDB. It provides a RESTful API for managing books, users, orders, and more.

## 🔧 Setup & Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables (see below).
4.  Start the server:
    ```bash
    # Run server only
    npm run server

    # Run server and frontend concurrently
    npm run dev
    ```

## 🔑 Environment Variables

Create a `.env` file in the `backend/` root with the following keys:

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default: 5001) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `FRONTEND_URL` | URL of the frontend application (for CORS) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `EMAIL_USER` | Email address for sending notifications (optional) |
| `EMAIL_PASS` | Email password/app password (optional) |

## 📡 API Endpoints

### Authentication & Users
- `POST /api/users/login` - Authenticate user & get token
- `POST /api/users` - Register a new user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Books
- `GET /api/books` - Fetch all books
- `GET /api/books/:id` - Fetch single book
- `POST /api/books` - Create a book (Admin)
- `PUT /api/books/:id` - Update a book (Admin)
- `DELETE /api/books/:id` - Delete a book (Admin)
- `POST /api/books/:id/reviews` - Create a review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)
- `GET /api/orders/myorders` - Get logged-in user's orders

### Other Resources
- `/api/authors` - Manage authors
- `/api/categories` - Manage book categories
- `/api/publishers` - Manage publishers
- `/api/upload` - Image upload endpoint
- `/api/config/paypal` - Get PayPal client ID (if applicable)

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: Authentication tokens
- **passport**: Authentication middleware
- **cloudinary** & **multer**: Image upload and storage
- **stripe**: Payment processing
- **nodemailer**: Email sending
