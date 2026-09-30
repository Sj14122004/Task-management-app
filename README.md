Task Management App

A full-stack task management application where users sign in with Google, create and assign tasks, track progress, and receive email notifications when tasks are assigned or completed.

Features
Google OAuth 2.0 sign-in
Persistent login using HTTP-only Flask sessions
Create, update, complete, and delete tasks
Assign tasks to other registered users
Track task status
Email notification when a task is assigned
Email notification when a task is completed
Activity log for task creation, completion, and deletion
Responsive dashboard and task management interface
Toast notifications for user actions
Tech Stack
Layer	Technologies
Frontend	Next.js, TypeScript, Tailwind CSS, Sonner
Backend	Python, Flask, psycopg, Google OAuth 2.0, Gmail SMTP
Database	PostgreSQL (local), Supabase PostgreSQL (production)
Architecture
text
Next.js + TypeScript
        |
        |  HTTP / REST API
        v
Flask Backend
        |-- Authentication
        |-- Task Management
        |-- Activity Logging
        |-- Email Notifications
        |
        v
PostgreSQL / Supabase

Google sign-in is handled on the frontend. The resulting Google credential is sent to the Flask backend, which verifies it, creates the user if they don't exist, and stores the user's ID in a session.

Project Structure
text
task-management-app/
├── apps/
│   ├── frontend/
│   │   ├── app/
│   │   └── package.json
│   └── backend/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── migrations/
│       ├── database.py
│       ├── run.py
│       └── .env.example
├── .gitignore
└── README.md
How It Works
Authentication
The user signs in with their Google account.
Google returns an identity credential.
The Flask backend verifies the credential.
The backend finds or creates the user and stores their ID in a session.
The frontend calls /api/auth/me to check the current session.
Task Management

Authenticated users can:

Create a task with a title, description, and due date
Assign a task to another registered user
View tasks they created or were assigned
Change a task's status and mark it as completed
Delete tasks they created
Activity Tracking

Task creation, completion, and deletion are recorded in an activity log. Users can view it on the Activity page and clear it when needed.

Email Notifications

Gmail SMTP sends an email when a task is assigned and when a task is completed. A Gmail App Password is used, so the account password is never stored.

Setup
1. Clone the Repository
bash
git clone <your-github-repository-url>
cd task-management-app
2. Backend Setup
bash
cd apps/backend
python -m venv .venv

Activate the virtual environment:

bash
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

Install dependencies and create your environment file:

bash
pip install -r requirements.txt
copy .env.example .env      # Windows
cp .env.example .env        # macOS / Linux

Open .env and fill in your database, Google OAuth, Gmail, and Flask values, then start the server:

bash
python run.py

The backend runs on http://localhost:5000.

3. Frontend Setup

Open a new terminal:

bash
cd apps/frontend
npm install
copy .env.example .env      # Windows
cp .env.example .env        # macOS / Linux

Set the backend API URL in .env, then start the app:

bash
npm run dev

The frontend runs on http://localhost:3000.

4. Database Setup

The app uses PostgreSQL. Create a database, add its connection string to the backend .env, and apply the schema from:

text
apps/backend/migrations/

Main tables: users, tasks, activity_logs.

5. Google OAuth Setup

Create an OAuth 2.0 client in Google Cloud Console and add your local and production frontend URLs as authorized origins. Provide the Google Client ID through the environment files.

6. Gmail Setup

Create a Gmail App Password and add the Gmail address and app password to the backend .env.

Never commit .env files or real credentials to GitHub.

7. Run the Application
Service	URL
Backend	http://localhost:5000
Frontend	http://localhost:3000

Open the frontend URL in your browser and sign in with Google.

API Overview
Authentication
Method	Endpoint	Description
POST	/api/auth/google	Sign in with Google
GET	/api/auth/me	Get the current session
POST	/api/auth/logout	Log out
Tasks
Method	Endpoint	Description
GET	/api/tasks	List your tasks
POST	/api/tasks	Create a task
PATCH	/api/tasks/<task_id>	Update a task
DELETE	/api/tasks/<task_id>	Delete a task
Users
Method	Endpoint	Description
GET	/api/users	List registered users
Activities
Method	Endpoint	Description
GET	/api/activities	List activity log
DELETE	/api/activities	Clear activity log
Deployment
Component	Platform
Frontend	Vercel
Backend	Railway or Render
Database	Supabase

Set the production environment variables and add the deployed frontend URL to the Google OAuth authorized origins.

Live URL: to be added after deployment

Future Improvements
Role-based permissions
Task search and filtering
Pagination
Real-time task updates
Better email templates
Passwordless authentication options
Background email processing
Author

Shivam Joshi Full Stack Developer