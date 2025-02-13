# Oficina Oliveira - Stock Manager

Welcome to the Stock Manager for Oficina Oliveira, a reputable company with over 20 years of experience in the industry. This project is designed to help manage your inventory efficiently, keeping track of stock levels and maintaining a history of all stock movements.

## Project Overview

The Stock Manager is a web-based application developed using Flask and SQLite. It provides a simple and intuitive interface for managing your inventory, making it suitable for any company or autonomous professional.

### Features

- **User Authentication**: Secure login system using hashed passwords.
- **Inventory Management**: Add, update, and view items in your inventory.
- **Stock Movements**: Record and track stock additions and sales.
- **History Access**: Maintain a detailed history of all stock movements for auditing and reporting purposes.

### Endpoints

- **/login**: Authenticate users.
- **/items**: 
    - `POST`: Add stock or sell items.
    - `GET`: Retrieve a list of all items.
- **/items/<item_id>**: 
    - `GET`: Retrieve details of a specific item by its ID.

### Developed By Mikael Baracho

This project is developed by Mikael Baracho, a fullstack developer with a passion for creating efficient and user-friendly applications.

## Getting Started

To get started with the Stock Manager, follow these steps:

1. **Clone the repository**:
        ```sh
        git clone <repository-url>
        ```

2. **Navigate to the project directory**:
        ```sh
        cd backend/src
        ```

3. **Install the required dependencies**:
        ```sh
        pip install -r requirements.txt
        ```

4. **Run the application**:
        ```sh
        python app.py
        ```

## License

This project is licensed under the MIT License.

For any questions or support, please contact Mikael Baracho.

Thank you for choosing Oficina Oliveira Stock Manager!
