# ParkEase - Parking Management System

ParkEase is a web-based parking management system that helps users book parking slots, manage bookings, and view reports.

## Prerequisites

Before you begin, ensure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

Follow these simple steps to get the project running on your machine:

### 1. Download and Extract the Project
- Download the project ZIP file
- Extract it to a folder on your computer

### 2. Open Terminal/Command Prompt
- Windows: Press `Win + R`, type `cmd`, and press Enter
- Mac: Press `Command + Space`, type `terminal`, and press Enter

### 3. Navigate to Project Directory
```bash
cd path/to/your/extracted/folder/client
```
(Replace "path/to/your/extracted/folder" with the actual path where you extracted the project)

### 4. Install Dependencies
```bash
npm install
```
Wait for all dependencies to be installed (this might take a few minutes)

### 5. Start the Development Server
```bash
npm start
```
The application will automatically open in your default web browser at http://localhost:3000

## Using the Application

1. **Register/Login**
   - Create a new account or login with existing credentials

2. **Book Parking**
   - Click "BOOK PARKING" in Quick Actions
   - Select a parking area and available slot
   - Fill in vehicle details and duration
   - Confirm booking

3. **View Bookings**
   - Click "VIEW BOOKINGS" in Quick Actions
   - See all your bookings categorized as:
     - Active Bookings
     - Past Bookings
     - Upcoming Bookings

4. **Reports**
   - Click "VIEW REPORTS" to see booking statistics

## Common Issues and Solutions

1. **"npm not found" error**
   - Make sure Node.js is properly installed
   - Try restarting your computer
   - Open a new terminal window

2. **"Port 3000 is already in use" error**
   - Close other running applications
   - Or try using a different port:
     ```bash
     set PORT=3001 && npm start    # For Windows
     PORT=3001 npm start          # For Mac/Linux
     ```

3. **Dependencies installation fails**
   - Try clearing npm cache:
     ```bash
     npm cache clean --force
     npm install
     ```

## Project Structure
```
client/
├── public/          # Static files
├── src/             # Source code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── store/       # Redux store
│   └── App.js       # Main app component
└── package.json     # Project dependencies
```

## Need Help?

If you encounter any issues:
1. Make sure you followed all steps in order
2. Check the Common Issues section above
3. Try restarting your terminal and running the commands again
4. Google the exact error message you're seeing

## Additional Notes

- The application uses local storage for data persistence
- Make sure your browser supports local storage
- Clear browser cache if you experience strange behavior
- The server runs in development mode, suitable for local testing

## Browser Support

The application works best on:
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App
npm run eject
``` 