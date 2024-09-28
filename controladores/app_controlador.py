from flask import Blueprint, render_template

app_bp = Blueprint('app_bp', __name__)

@app_bp.route('/')
def dashboard():
    return render_template('dashboard.html')
