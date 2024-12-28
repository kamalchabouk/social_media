# Social Media App

A social media platform where users can create posts, comment, and interact with each other. This project currently has a Django backend, and a React frontend will be integrated once the backend is complete. The app includes features like user authentication, profile management, and real-time updates.

## Features
- User registration and login (using Django Allauth) so the User can use facebook,instagram,google or apple to log in.
- Profile management (users can update their profile picture, bio, etc.)
- Ability to create, view, and delete posts
- Commenting system on posts
- Like and share posts
- Real-time updates (using WebSockets or polling)
- Mobile-responsive design (for future frontend)

## Technologies Used
- **Backend:** Django (Python)
- **Frontend:** React (coming soon)
- **Database:** MariaDB
- **Authentication:** Django Allauth
- **Version Control:** Git, GitHub

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

5. Set up environment variables (refer to the `.env` file in the repository):
   - Create a `.env` file in the root directory.
   - Add your database settings, secret key, etc.
   
   Example:
   ```bash
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   SECRET_KEY=your_secret_key
   ```


6. Run the to make migrations:
   ```bash
   python3 manage.py makemigrations
   ```
 
7. Run the database migrations:
   ```bash
   python3 manage.py migrate
   ```

8. Start the Django development server:
   ```bash
   python3 manage.py runserver
   ```

Once the frontend is integrated with React, you'll update this section with additional instructions for setting up the React app.