from waitress import serve # type: ignore
from app import app  # This imports the 'app' variable from app.py
import logging

logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
        print("By Mikael_Baracho_Development\nOficina Oliveira - Stock Management\nServer already running! :D\n---------", flush=True)
        serve(app, host='0.0.0.0', port=81)
