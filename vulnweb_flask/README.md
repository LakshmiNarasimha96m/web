# VulnWeb Flask App

This is a Flask-based web application converted from the frontend-only clone of testphp.vulnweb.com.

## Features
- User registration and login with session management
- Search functionality that stores data in database
- Basic authentication and validation
- SQLite database for users, logs, and form data

## Folder Structure
```
vulnweb_flask/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── database.db            # SQLite database (created automatically)
├── templates/             # HTML templates
│   ├── base.html          # Base template with common layout
│   ├── index.html         # Home page
│   ├── search.html        # Search page
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   └── ...                # Other page templates
└── static/                # Static files (CSS, images)
    ├── style.css          # Stylesheet
    └── images/            # Image assets
```

## Setup Instructions
1. Navigate to the vulnweb_flask directory
2. Install dependencies: `pip install -r requirements.txt`
3. Run the app: `python app.py`
4. Open your browser to http://127.0.0.1:5000/

## Usage
- Register a new account at /register
- Login at /login
- Use the search form to search for art (data is stored in DB)
- Other menu links lead to placeholder pages

## Notes
- Passwords are stored in plain text for simplicity; in production, use hashing.
- This is a basic implementation; expand as needed for full functionality.