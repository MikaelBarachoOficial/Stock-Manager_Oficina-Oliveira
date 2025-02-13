import bcrypt
from flask import Flask, request, jsonify
from database import init_db, execute_query, fetch_all, fetch_one, add_history_entry

app = Flask(__name__)

# Initialize the database
init_db()

@app.route('/login', methods=['POST'])
def login():
    # Get the JSON data sent in the request body
    data = request.get_json()
    # SQL query to select the hashed password from the login table
    query = 'SELECT password FROM login'
    # Fetch the hashed password from the database
    hashed_password = fetch_one(query)
    # Check if the provided password matches the hashed password
    if bcrypt.checkpw(data['password'].encode('utf-8'), hashed_password['password']):
        # Return a JSON response indicating success
        return jsonify({"message": "Login successful"}), 200
    else:
        # Return a JSON response indicating failure
        return jsonify({"message": "Login failed"}), 401

@app.route('/items/add_item', methods=['POST'])
def add_item():
    # Get the JSON data sent in the request body
    data = request.get_json()
    code = data.get('code')
    name = data.get('name')
    quantity = data.get('quantity')
    cost_value = data.get('cost_value')
    sell_value = data.get('sell_value')

    if not code or not name or not quantity or not cost_value or not sell_value:
        return jsonify({"message": "All inputs must be sent."}), 400

    # Check if an item with the same code or name already exists
    query = 'SELECT * FROM items WHERE code = ? OR name = ?'
    existing_item = fetch_one(query, (code, name))

    if existing_item:
        return jsonify({"message": "An item with the same code or name already exists."}), 400

    # SQL query to insert a new item into the items table
    query = 'INSERT INTO items (code, name, quantity, cost_value, sell_value) VALUES (?, ?, ?, ?, ?)'
    # Execute the query with the provided item data
    item_id = execute_query(query, (code, name, quantity, cost_value, sell_value))

    # Add a history entry for creating the item
    add_history_entry(item_id, code, quantity, cost_value, sell_value, 'create_item')

    # Return a JSON response with the ID of the newly created item
    return jsonify({"message": "Item created successfully!", "item_id": item_id}), 201

@app.route('/items/delete_item/<string:code>', methods=['DELETE'])
def delete_item(code):
    # Fetch the item by code
    query = 'SELECT * FROM items WHERE code = ?'
    item = fetch_one(query, (code,))
    
    if not item:
        return jsonify({"message": "Item not found"}), 404

    # SQL query to delete the item from the items table
    query = 'DELETE FROM items WHERE code = ?'
    execute_query(query, (code,))
    # Add a history entry for deleting the item
    add_history_entry(item['id'], code, item['quantity'], item['cost_value'], item['sell_value'], 'delete_item')
    # Return a JSON response indicating success
    return jsonify({"message": "Item deleted successfully!"}), 200


@app.route('/items/add_and_sell', methods=['PUT'])
def add_and_sell_stock():
    # Get the JSON data sent in the request body
    data = request.get_json()
    action = data.get('action')
    code = data.get('code')
    quantity = data.get('quantity')

    if not action or not code or not quantity:
        return jsonify({"message": "Invalid input"}), 400

    # Fetch the item by code
    query = 'SELECT * FROM items WHERE code = ?'
    item = fetch_one(query, (code,))

    if not item:
        return jsonify({"message": "Item not found"}), 404

    if action == 'add_stock':
        # Update the quantity of the item
        new_quantity = item['quantity'] + quantity
        query = 'UPDATE items SET quantity = ? WHERE code = ?'
        execute_query(query, (new_quantity, code))
        # Add a history entry for adding stock
        add_history_entry(item['id'], code, quantity, item['cost_value'], item['sell_value'], 'add_stock')
        return jsonify({"message": "Stock added successfully!", "new_quantity": new_quantity}), 200

    elif action == 'sell':
        if item['quantity'] < quantity:
            return jsonify({"message": "Insufficient stock"}), 400
        # Update the quantity of the item
        new_quantity = item['quantity'] - quantity
        query = 'UPDATE items SET quantity = ? WHERE code = ?'
        execute_query(query, (new_quantity, code))
        # Add a history entry for selling stock
        add_history_entry(item['id'], code, quantity, item['cost_value'], item['sell_value'], 'sell')
        return jsonify({"message": "Item sold successfully!", "new_quantity": new_quantity}), 200

    else:
        return jsonify({"message": "Invalid action"}), 400

@app.route('/items', methods=['GET'])
def get_items():
    # SQL query to select all items from the items table
    query = 'SELECT * FROM items'
    # Execute the query and fetch all results
    items = fetch_all(query)
    # Return a JSON response with the list of items
    return jsonify([dict(item) for item in items]), 200

@app.route('/items/<string:code>', methods=['GET'])
def get_item(item_code):
    # SQL query to select an item by its ID
    query = 'SELECT * FROM items WHERE code = ?'
    # Execute the query with the provided item ID
    item = fetch_one(query, (item_code,))
    # If the item is found, return its data as a JSON response
    if item:
        return jsonify(dict(item)), 200
    # If the item is not found, return a JSON response indicating the item was not found
    else:
        return jsonify({"message": "Item not found"}), 404
    
@app.route('/history/clear', methods=['DELETE'])
def clear_history():
    # SQL query to delete all entries from the history table
    query = 'DELETE FROM history'
    # Execute the query to clear the history
    execute_query(query)
    # Return a JSON response indicating success
    return jsonify({"message": "History cleared successfully!"}), 200

if __name__ == "__main__":
    # Start the Flask development server with debugging enabled
    app.run(debug=True)