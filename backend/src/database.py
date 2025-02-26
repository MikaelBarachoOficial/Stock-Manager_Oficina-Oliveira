import sqlite3
import bcrypt
import os
from datetime import datetime

# Define o caminho para o banco de dados dentro de AppData
APPDATA_PATH = os.path.join(os.getenv("APPDATA"), "OficinaOliveiraServerDB")
DB_PATH = os.path.join(APPDATA_PATH, "database.db")

# Garante que o diretório existe
os.makedirs(APPDATA_PATH, exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def close_db_connection(conn):
    if conn:
        conn.close()

def init_login():
    conn = get_db_connection()
    with conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS login (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                password TEXT NOT NULL
            )
        ''')
        # Check if the table already contains a password
        result = conn.execute('SELECT COUNT(*) FROM login').fetchone()
        if result[0] == 0:
            # Hash the default password
            default_password = 'admin1234'
            hashed_password = bcrypt.hashpw(default_password.encode('utf-8'), bcrypt.gensalt())
            # Insert the default password
            conn.execute('''
                INSERT INTO login (password) VALUES (?)
            ''', (hashed_password,))
    close_db_connection(conn)

def init_items():
    conn = get_db_connection()
    with conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                cost_value REAL NOT NULL,
                sell_value REAL NOT NULL,
                last_update TEXT NOT NULL,
                date_created TEXT NOT NULL
            )
        ''')
    close_db_connection(conn)

def add_item_entry(code, name, quantity, cost_value, sell_value):
    # Get the current timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    query = '''
        INSERT INTO items (code, name, quantity, cost_value, sell_value, last_update, date_created)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    '''
    return execute_query(query, (code, name, quantity, cost_value, sell_value, timestamp, timestamp))

def execute_query(query, params=()):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    last_id = cursor.lastrowid
    close_db_connection(conn)
    return last_id

def fetch_all(query, params=()):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    close_db_connection(conn)
    return rows

def fetch_one(query, params=()):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    row = cursor.fetchone()
    close_db_connection(conn)
    return row

def init_history():
    conn = get_db_connection()
    with conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_id INTEGER NOT NULL,
                item_code TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                cost_value REAL NOT NULL,
                sell_value REAL NOT NULL,
                action_type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (item_id) REFERENCES items(id) 
            )
        ''')
    close_db_connection(conn) #CAREFULL WITH LAST LINE REFERENCING ITEMS

def add_history_entry(item_id, item_code, quantity, cost_value, sell_value, action_type):
    # Get the current timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    query = '''
        INSERT INTO history (item_id, item_code, quantity, cost_value, sell_value, action_type, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    '''
    return execute_query(query, (item_id, item_code, quantity, cost_value, sell_value, action_type, timestamp))

def init_db():
    init_login()
    init_items()
    init_history()

