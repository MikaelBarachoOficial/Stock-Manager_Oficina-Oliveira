import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, execute_query, fetch_all, fetch_one, add_history_entry, add_item_entry
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize the database
init_db()

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'password' not in data:
            return jsonify({"message": "Password is required"}), 400
        
        # Limit to one result if your table has only one login row
        query = 'SELECT password FROM login LIMIT 1'
        hashed_password = fetch_one(query)
        
        if not hashed_password:
            return jsonify({"message": "User not found"}), 404
        
        # Ensure the stored hashed password is bytes, or encode it if stored as str
        stored_hash = hashed_password['password']
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode('utf-8')
        
        if bcrypt.checkpw(data['password'].encode('utf-8'), stored_hash):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Login failed"}), 401
    
    except Exception as e:
        print("Error in /login:", e)
        return jsonify({"message": "An internal error occurred", "error": str(e)}), 500


@app.route('/items/add_item', methods=['POST'])
def add_item():
    try:
        data = request.get_json()
        code = data.get('code')
        name = data.get('name')
        quantity = data.get('quantity')
        cost_value = data.get('cost_value')
        sell_value = data.get('sell_value')

        if not code or not name or not quantity or not cost_value or not sell_value:
            return jsonify({"message": "All inputs must be sent."}), 400

        query = 'SELECT * FROM items WHERE code = ? OR name = ?'
        existing_item = fetch_one(query, (code, name))
        if existing_item:
            return jsonify({"message": "An item with the same code or name already exists."}), 400

        # Use your add_item_entry function that sets the timestamps
        item_id = add_item_entry(code, name, quantity, cost_value, sell_value)

        add_history_entry(item_id, code, quantity, cost_value, sell_value, 'create_item')

        return jsonify({"message": "Item created successfully!", "item_id": item_id}), 201

    except Exception as e:
        print("Error in /items/add_item:", e)
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

@app.route('/items/update_item', methods=['PUT'])
def update_item():
    try:
        # Get JSON data from the request body
        data = request.get_json()
        code = data.get('code')
        name = data.get('name')
        quantity = data.get('quantity')
        cost_value = data.get('cost_value')
        sell_value = data.get('sell_value')
        
        # Validate that the code is provided
        if not code:
            return jsonify({"message": "Item code is required for update."}), 400
        
        # Validate that at least one field is provided to update
        if name is None and quantity is None and cost_value is None and sell_value is None:
            return jsonify({"message": "At least one field must be provided for update."}), 400

        # Fetch the existing item by code
        query = 'SELECT * FROM items WHERE code = ?'
        item = fetch_one(query, (code,))
        if not item:
            return jsonify({"message": "Item not found."}), 404

        # For any field not provided, use the existing value from the database
        new_name = name if name is not None else item['name']
        new_quantity = quantity if quantity is not None else item['quantity']
        new_cost_value = cost_value if cost_value is not None else item['cost_value']
        new_sell_value = sell_value if sell_value is not None else item['sell_value']

        # Get the current timestamp for last_update
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Update the item's information and last_update timestamp
        update_query = '''
            UPDATE items 
            SET name = ?, quantity = ?, cost_value = ?, sell_value = ?, last_update = ? 
            WHERE code = ?
        '''
        execute_query(update_query, (new_name, new_quantity, new_cost_value, new_sell_value, timestamp, code))

        # Add a history entry for updating the item using the new values
        add_history_entry(item['id'], code, new_quantity, new_cost_value, new_sell_value, 'update_item')

        return jsonify({"message": "Item updated successfully!"}), 200

    except Exception as e:
        print("Error in /items/update_item:", e)
        return jsonify({"message": "Internal server error", "error": str(e)}), 500


    except Exception as e:
        print("Error in /items/update_item:", e)
        return jsonify({"message": "Internal server error", "error": str(e)}), 500


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
    try:
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

        # Get the current timestamp for the last_update field
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        if action == 'add_stock':
            # Update the quantity of the item and set last_update
            new_quantity = item['quantity'] + quantity
            query = 'UPDATE items SET quantity = ?, last_update = ? WHERE code = ?'
            execute_query(query, (new_quantity, timestamp, code))
            # Add a history entry for adding stock
            add_history_entry(item['id'], code, quantity, item['cost_value'], item['sell_value'], 'add_stock')
            return jsonify({"message": "Stock added successfully!", "new_quantity": new_quantity}), 200

        elif action == 'sell':
            if item['quantity'] < quantity:
                return jsonify({"message": "Insufficient stock"}), 400
            # Update the quantity of the item and set last_update
            new_quantity = item['quantity'] - quantity
            query = 'UPDATE items SET quantity = ?, last_update = ? WHERE code = ?'
            execute_query(query, (new_quantity, timestamp, code))
            # Add a history entry for selling stock
            add_history_entry(item['id'], code, quantity, item['cost_value'], item['sell_value'], 'sell')
            return jsonify({"message": "Item sold successfully!", "new_quantity": new_quantity}), 200

        else:
            return jsonify({"message": "Invalid action"}), 400

    except Exception as e:
        print("Error in /items/add_and_sell:", e)
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

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
    
@app.route('/history', methods=['GET'])
def get_all_history():
    # Define your SQL query to select all rows from the "history" table
    query = "SELECT * FROM history"
    
    # Execute the query using your database helper function
    rows = fetch_all(query)
    
    # Convert each row to a dictionary and return as JSON
    return jsonify([dict(row) for row in rows]), 200
    
@app.route('/history/clear', methods=['DELETE'])
def clear_history():
    # SQL query to delete all entries from the history table
    query = 'DELETE FROM history'
    # Execute the query to clear the history
    execute_query(query)
    # Return a JSON response indicating success
    return jsonify({"message": "History cleared successfully!"}), 200

@app.route('/login/change_password', methods=['PUT'])
def change_password():
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"message": "New password must be sent."}), 400

    # Hash a nova senha
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Atualiza a senha apenas para o registro com id=1
    query = 'UPDATE login SET password = ? WHERE id = 1'
    execute_query(query, (hashed_password,))

    return jsonify({"message": "Password changed successfully!"}), 200


@app.route('/checkstatus', methods=['GET'])
def index():
    return jsonify({'message': 'Server is working!'}), 200
