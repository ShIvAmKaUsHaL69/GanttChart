# Gantt Chart Project Setup Guide

This document provides detailed step-by-step instructions to set up and run the Gantt Chart Project Management application.

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (v5.7 or higher)

## Step 1: Database Setup

1. First, create a MySQL database for the application:

```sql
CREATE DATABASE gantt_chart_db;
```

2. Make a copy of the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

3. Open the `.env` file and update the database credentials according to your MySQL setup:

```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=gantt_chart_db
JWT_SECRET=choose_a_secure_secret_key
```

## Step 2: Install Dependencies

Install all required dependencies for both frontend and backend:

```bash
npm install
```

## Step 3: Initialize the Database

Run the database initialization script to create the necessary tables and the default admin user:

```bash
npm run init-db
```

This creates the following database tables:
- `projects` - Stores project information
- `tasks` - Stores task information with relationships to projects
- `users` - Stores user authentication information

It also creates a default admin user:
- Username: `admin`
- Password: `admin123`

## Step 4: Start the Application

### For Development

1. Start the backend server in development mode:

```bash
npm run server:dev
```

2. In a new terminal, start the frontend development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

### For Production

1. Build the frontend:

```bash
npm run build
```

2. Start the production server (which serves both frontend and API):

```bash
npm start
```

The application will be available at http://localhost:5000

## Step 5: Access the Application

1. Open your web browser and navigate to:
   - Development: http://localhost:5173
   - Production: http://localhost:5000

2. Log in with the default admin credentials:
   - Username: `admin`
   - Password: `admin123`

## Common Issues and Troubleshooting

### ES Module Syntax Issues

This project uses ES Modules instead of CommonJS. If you encounter import/export related errors, run:

```bash
npm run fix-imports
```

This will automatically convert any remaining CommonJS syntax to ES Module syntax in the server files.

### CSS for Gantt Chart

If you encounter issues with the Gantt chart styles not being applied correctly, check that:

1. The custom CSS file at `src/styles/gantt.css` is being imported correctly in `src/main.jsx`
2. The Gantt chart component is properly rendering the chart

### Database Connection Issues

If you're having trouble connecting to the database:

1. Make sure MySQL is running
2. Check your `.env` file has the correct credentials
3. If needed, you can manually create the database:

```sql
CREATE DATABASE gantt_chart_db;
```

### Port Conflicts

If port 5000 (API) or 5173 (Dev server) is already in use:

1. Change the `PORT` in `.env` file for the backend
2. For the frontend development server, use:
```bash
npm run dev -- --port 3000  # Change to any available port
```

### Running Specific Servers

To run just the backend server in development mode:

```bash
npm run server:dev
```

To run just the frontend development server:

```bash
npm run dev
```

To run both concurrently, you'll need two terminal windows, one for each command.

## Next Steps

After successfully setting up the application:

1. Change the default admin password for security
2. Create your first project
3. Add tasks to your project
4. View and manage your project with the Gantt chart 