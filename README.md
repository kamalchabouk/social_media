# Social Media App

A social media platform where users can create posts, share other posts, like, unlike, comment, and interact with each other. This project features a Django backend and a React frontend. The backend handles user authentication, profile management, and core functionality, while the React frontend currently implements Google login and authentication. Additional frontend features are under development.

## Features

- **User registration and login**: Integrated Google login functionality using Django Allauth.
- **Profile management**: Users can update their profile picture, bio, and other information.
- **Post management**: Ability to create, view, and delete posts.
- **Direct messages (DMs)**: Real-time messaging feature (under development).
- **Social interactions**: Like, comment, share posts, follow/unfollow users (in progress).
- **Real-time updates**: Planned implementation using WebSockets or polling.
- **Mobile-responsive design**: To be developed in the React frontend.

## Technologies Used

- **Backend**: Django (Python)
- **Frontend**: React (implemented with authentication, other features in progress)
- **Database**: MariaDB
- **Authentication**: Django Allauth with Google login integration
- **Version Control**: Git, GitHub

## Installation Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/social_media.git
   ```

2. Navigate to the project directory:

   ```bash
   cd social_media
   ```

3. Create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows, use .venv\Scripts\activate
   ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add your database settings, secret key, and other necessary variables.

   Example:

   ```
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   SECRET_KEY=your_secret_key
   ```

6. Apply migrations to set up the database:

   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

7. Start the Django development server:

   ```bash
   python3 manage.py runserver
   ```

8. Set up the React frontend:

   - Navigate to the `frontend` directory:

     ```bash
     cd frontend
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Start the development server:

     ```bash
     npm start
     ```

## Current Status

- The React frontend includes Google login functionality.
- Backend functionalities for authentication, profile management, and post creation are complete.
- Direct messages, social interactions (likes, comments, shares), and real-time updates are in progress.

Stay tuned for future updates as we continue to enhance this project!
