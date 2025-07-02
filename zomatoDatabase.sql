create database zomato;

use zomato;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dining Places table
CREATE TABLE IF NOT EXISTS dining_places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cuisine_type VARCHAR(100) NOT NULL,
    total_tables INT NOT NULL,
    opening_hours VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dining_place_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('booked', 'cancelled') DEFAULT 'booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (dining_place_id) REFERENCES dining_places(id)
);

-- Sample data for users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', 'admin123', 'admin'),
('Normal User', 'user@example.com', 'user123', 'user');

-- Sample data for dining_places
INSERT INTO dining_places (name, address, cuisine_type, total_tables, opening_hours) VALUES
('Spicy Villa', '123 Main St', 'Indian', 10, '10:00-22:00'),
('Pasta Palace', '456 Elm St', 'Italian', 8, '11:00-23:00');

-- Sample data for bookings
INSERT INTO bookings (user_id, dining_place_id, booking_date, booking_time, status) VALUES
(2, 1, '2024-06-20', '19:00:00', 'booked');