from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Change this to a random secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)  # In production, hash passwords!

class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    action = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=db.func.now())

class FormData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    form_type = db.Column(db.String(100))
    data = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=db.func.now())

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        search_term = request.form['searchFor']
        if 'user_id' in session:
            # Log the search action
            log = Log(user_id=session['user_id'], action=f'Searched for: {search_term}')
            db.session.add(log)
            # Store form data
            form_data = FormData(user_id=session['user_id'], form_type='search', data=search_term)
            db.session.add(form_data)
            db.session.commit()
        return render_template('search.html', search_term=search_term)
    return render_template('search.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Logged in successfully')
            return redirect(url_for('index'))
        else:
            flash('Invalid credentials')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
        else:
            user = User(username=username, password=password)
            db.session.add(user)
            db.session.commit()
            flash('Registered successfully')
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    flash('Logged out')
    return redirect(url_for('index'))

# Placeholder routes for other pages
@app.route('/categories')
def categories():
    return render_template('categories.html')

@app.route('/artists')
def artists():
    return render_template('artists.html')

@app.route('/disclaimer')
def disclaimer():
    return render_template('disclaimer.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/guestbook')
def guestbook():
    return render_template('guestbook.html')

@app.route('/ajax_demo')
def ajax_demo():
    return render_template('ajax_demo.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True)