import sys
import os

# Add your project directory to the sys.path
path = '/home/sohamshaw23/Bharat-Resilience-Engine'
if path not in sys.path:
    sys.path.append(path)

# Set up environment variables
os.environ['FLASK_ENV'] = 'production'

from app import app as application
