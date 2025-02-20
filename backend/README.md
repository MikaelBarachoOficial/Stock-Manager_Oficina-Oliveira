# Oficina Oliveira Server Backend

This backend is built using Flask and SQLite to manage a simple inventory system. It includes functionalities for user authentication, item management, and history tracking.

When your ssl expire, paste this on the Server Folder:
```sh
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```
or
```sh
& "C:\Program Files (x86)\OficinaOliveira\openssl\openssl.exe" req -x509 -newkey rsa:4096 -keyout "C:\Program Files (x86)\OficinaOliveira\key.pem" -out "C:\Program Files (x86)\OficinaOliveira\cert.pem" -days 365 -nodes -subj "/CN=localhost"
```

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repository_url>
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```sh
   python src/app.py
   ```

## Database

The database is managed using SQLite. The following tables are created and used:

- **login:** Stores the hashed password for authentication.
- **items:** Stores the inventory items.
- **history:** Tracks changes made to the items.

### Initialization

The database is initialized with the following functions:

- `init_login()`: Creates the `login` table and inserts a default password if none exists.
- `init_items()`: Creates the `items` table.
- `init_history()`: Creates the `history` table.

### Utility Functions

- `get_db_connection()`: Establishes a connection to the SQLite database.
- `close_db_connection(conn)`: Closes the database connection.
- `execute_query(query, params)`: Executes a given SQL query with parameters.
- `fetch_all(query, params)`: Fetches all rows for a given SQL query.

## Endpoints and Routes

### User Authentication

- **POST /login**
  - Authenticates a user with a username and password.
  - Request body: `{ "username": "user", "password": "pass" }`
  - Response: `{ "message": "Login successful" }` or `{ "error": "Invalid credentials" }`

### Item Management

- **GET /items**
  - Retrieves all items in the inventory.
  - Response: `[ { "id": 1, "name": "item1", "quantity": 10 }, ... ]`

- **POST /items**
  - Adds a new item to the inventory.
  - Request body: `{ "name": "item1", "quantity": 10 }`
  - Response: `{ "message": "Item added successfully" }`

- **PUT /items/<id>**
  - Updates an existing item in the inventory.
  - Request body: `{ "name": "item1", "quantity": 15 }`
  - Response: `{ "message": "Item updated successfully" }`

- **DELETE /items/<id>**
  - Deletes an item from the inventory.
  - Response: `{ "message": "Item deleted successfully" }`

### History Tracking

- **GET /history**
  - Retrieves the history of changes made to the items.
  - Response: `[ { "id": 1, "item_id": 1, "change": "added", "timestamp": "2023-01-01T00:00:00Z" }, ... ]`