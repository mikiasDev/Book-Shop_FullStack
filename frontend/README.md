# Bookstore Frontend

The frontend client for the MERN Bookstore, built with React.js. It provides a responsive and interactive user interface for customers and administrators.

## 🚀 Getting Started

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🏗️ Architecture

- **Framework**: React (Create React App)
- **State Management**: Redux Toolkit (Store, Slices, RTK Query/Thunks)
- **Routing**: React Router v6
- **Styling**: React Bootstrap, Custom CSS, Material UI
- **HTTP Requests**: Axios (configured with interceptors)

## 📂 Key Directories

- `src/actions`: Redux action creators (if using legacy Redux)
- `src/components`: Reusable UI components (Header, Footer, Product, etc.)
- `src/constants`: Constant values and action types
- `src/pages` / `src/screens`: Main page views (HomeScreen, ProductScreen, CartScreen)
- `src/reducers`: Redux reducers
- `src/store.js`: Redux store configuration
- `src/admin`: Admin dashboard components and pages

## 📜 Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm run eject`: Ejects from Create React App (one-way operation).

## 🔌 Configuration

The frontend is configured to proxy API requests to the backend to avoid CORS issues during development.
In `package.json`:
```json
"proxy": "http://localhost:5000"
```
Ensure your backend is running on this port or update the proxy value.
