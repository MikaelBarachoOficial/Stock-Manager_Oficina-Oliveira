from flask import Blueprint

# Create a blueprint for the routes
routes_bp = Blueprint('routes', __name__)

# Import the route handlers
from . import example_routes  # Assuming you will create example_routes.py for handling specific routes