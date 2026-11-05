# Abhishek A L – Personal Portfolio

A full-stack personal portfolio website developed to showcase
personal information, academic qualifications, skills,
interests, projects and achievements.

## Features

- Welcome and introduction page
- Personal profile entry form
- Dynamic About Me page
- MongoDB profile storage
- Profile form validation
- Visitor feedback submission
- Display and hide submitted feedback
- Responsive website design

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

## Project Structure

abhishek-portfolio/
|
├── models/
|   ├── contact.js
|   ├── profile.js
|   └── feedback.js
|
├── public/
|   ├── index.html
|   ├── home.html
|   ├── about.html
|   ├── feedback.html
|   ├── style.css
|   ├── script.js
|   ├── profile.js
|   ├── about.js
|   └── feedback.js
|
├── server.js
├── package.json
├── package-lock.json
└── README.md

## Website Modules

1. Home Page
   Introduces the portfolio and provides navigation.

2. Personal Entry Form
   Allows the user to enter personal and academic information.

3. About Page
   Retrieves saved profile information from MongoDB.

4. Feedback Page
   Allows visitors to submit feedback and view submitted messages.

## Database

MongoDB Atlas is used to store profile information and
visitor feedback.

Mongoose is used to define schemas and communicate
with the MongoDB database.

## Installation

1. Clone this repository.

2. Install dependencies:

   npm install

3. Create a .env file in the project root.

4. Add your MongoDB connection string:

   MONGODB_URI=your_mongodb_connection_string

5. Start the application:

   npm start

6. Open:

   http://localhost:3003

## Deployment

The application is deployed using Render.

## Author

Abhishek A L

B.Sc. Computer Science and Statistics