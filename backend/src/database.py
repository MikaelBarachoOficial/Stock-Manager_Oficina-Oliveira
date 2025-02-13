import sqlite3
import bcrypt

def get_db_connection():
    conn = sqlite3.connect('database.db')
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
                sell_value REAL NOT NULL
            )
        ''')
    close_db_connection(conn)

def execute_query(query, params=()):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    close_db_connection(conn)
    return cursor.lastrowid

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
                quantity INTEGER NOT NULL,
                cost_value REAL NOT NULL,
                sell_value REAL NOT NULL,
                action_type TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
    close_db_connection(conn)

def init_db():
    init_login()
    init_items()
    init_history()