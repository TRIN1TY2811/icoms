CREATE DATABASE IF NOT EXISTS icoms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE icoms;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Table Drops (clean reset if re-importing)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS waste_records;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS login_attempts;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- Table Schemas
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('owner','staff') NOT NULL DEFAULT 'staff',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_attempts (
  ip_address VARCHAR(45) PRIMARY KEY,
  attempts INT NOT NULL DEFAULT 0,
  lockout_until INT NOT NULL DEFAULT 0
);

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  stock_qty DECIMAL(10,2) DEFAULT 0,
  reorder_point DECIMAL(10,2) DEFAULT 0,
  expiration_date DATE NULL,
  cost_per_unit DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  is_available TINYINT(1) DEFAULT 1
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE waste_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ingredient_id INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  reason ENUM('spill','spoilage','prep_error','other') NOT NULL,
  notes TEXT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ---------------------------------------------------------------------
-- Initial Data: Users
-- earl:    Password is "Earl123" (Owner)
-- maria:   Password is "Staff123" (Staff)
-- carlos:  Password is "Staff123" (Staff)
-- ---------------------------------------------------------------------
INSERT INTO users (id, full_name, username, password_hash, role, is_active, created_at) VALUES
(1, 'Earl', 'earl', '$2y$10$2zMRTW00dV.yo21a1QH95.1jxqvDmk1vmttD40Cl2mrseo9Shph6i', 'owner', 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 'Maria Santos', 'maria', '$2y$10$EK3vP7crqlwAs4bM1u87eOL78sfUpRkt/HetSu337By9k6FWQv6ui', 'staff', 1, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, 'Carlos Reyes', 'carlos', '$2y$10$EK3vP7crqlwAs4bM1u87eOL78sfUpRkt/HetSu337By9k6FWQv6ui', 'staff', 1, DATE_SUB(NOW(), INTERVAL 15 DAY));

-- ---------------------------------------------------------------------
-- Initial Data: Ingredients
-- ---------------------------------------------------------------------
INSERT INTO ingredients (id, name, unit, stock_qty, reorder_point, expiration_date, cost_per_unit) VALUES
(1, 'Espresso Beans (Arabica Blend)', 'g', 7500.00, 2000.00, DATE_ADD(CURDATE(), INTERVAL 90 DAY), 0.75),
(2, 'Fresh Whole Milk', 'ml', 15000.00, 3000.00, DATE_ADD(CURDATE(), INTERVAL 12 DAY), 0.09),
(3, 'Barista Oat Milk', 'ml', 6000.00, 2000.00, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 0.16),
(4, 'Vanilla Syrup', 'ml', 2500.00, 500.00, DATE_ADD(CURDATE(), INTERVAL 180 DAY), 0.35),
(5, 'Salted Caramel Syrup', 'ml', 1800.00, 500.00, DATE_ADD(CURDATE(), INTERVAL 180 DAY), 0.40),
(6, 'Dark Chocolate Sauce', 'ml', 2200.00, 600.00, DATE_ADD(CURDATE(), INTERVAL 120 DAY), 0.38),
(7, 'Ceremonial Matcha Powder', 'g', 650.00, 200.00, DATE_ADD(CURDATE(), INTERVAL 150 DAY), 1.80),
(8, 'Earl Grey Tea Leaves', 'g', 1200.00, 300.00, DATE_ADD(CURDATE(), INTERVAL 300 DAY), 0.55),
(9, 'Brown Sugar Syrup', 'ml', 3200.00, 800.00, DATE_ADD(CURDATE(), INTERVAL 120 DAY), 0.25),
(10, 'Heavy Whipping Cream', 'ml', 450.00, 500.00, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 0.22),
(11, 'Fresh Strawberries', 'g', 150.00, 200.00, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 0.65),
(12, 'Paper Hot Cups 12oz', 'pcs', 450.00, 100.00, NULL, 3.50),
(13, 'Clear Cold Cups 16oz', 'pcs', 80.00, 100.00, NULL, 3.20),
(14, 'Paper Straws', 'pcs', 600.00, 150.00, NULL, 0.50),
(15, 'Butter Croissant (Frozen)', 'pcs', 35.00, 15.00, DATE_ADD(CURDATE(), INTERVAL 20 DAY), 28.00),
(16, 'Chocolate Chip Cookie Dough', 'pcs', 45.00, 20.00, DATE_ADD(CURDATE(), INTERVAL 25 DAY), 18.00);

-- ---------------------------------------------------------------------
-- Initial Data: Menu Items
-- ---------------------------------------------------------------------
INSERT INTO menu_items (id, name, category, price, is_available) VALUES
(1, 'Caffe Americano', 'Espresso', 110.00, 1),
(2, 'Caffe Latte', 'Espresso', 140.00, 1),
(3, 'Spanish Latte', 'Espresso', 160.00, 1),
(4, 'Caramel Macchiato', 'Espresso', 165.00, 1),
(5, 'Iced Mocha', 'Cold Brew & Iced', 170.00, 1),
(6, 'Signature Cold Brew', 'Cold Brew & Iced', 130.00, 1),
(7, 'Iced Brown Sugar Oat Latte', 'Cold Brew & Iced', 180.00, 1),
(8, 'Iced Matcha Latte', 'Non-Coffee', 165.00, 1),
(9, 'London Fog Latte', 'Non-Coffee', 150.00, 1),
(10, 'Strawberry Milk', 'Non-Coffee', 155.00, 1),
(11, 'Fresh Baked Croissant', 'Pastries', 95.00, 1),
(12, 'Chocolate Chip Cookie', 'Pastries', 65.00, 1),
(13, 'Seasonal Mint Mocha', 'Cold Brew & Iced', 175.00, 0);

-- ---------------------------------------------------------------------
-- Initial Data: Recipes
-- ---------------------------------------------------------------------
INSERT INTO recipes (id, menu_item_id, ingredient_id, quantity) VALUES
(1, 1, 1, 18.00),
(2, 1, 12, 1.00),
(3, 2, 1, 18.00),
(4, 2, 2, 200.00),
(5, 2, 12, 1.00),
(6, 3, 1, 18.00),
(7, 3, 2, 180.00),
(8, 3, 4, 20.00),
(9, 3, 12, 1.00),
(10, 4, 1, 18.00),
(11, 4, 2, 180.00),
(12, 4, 5, 25.00),
(13, 4, 12, 1.00),
(14, 5, 1, 18.00),
(15, 5, 2, 160.00),
(16, 5, 6, 30.00),
(17, 5, 13, 1.00),
(18, 5, 14, 1.00),
(19, 6, 1, 25.00),
(20, 6, 13, 1.00),
(21, 6, 14, 1.00),
(22, 7, 1, 18.00),
(23, 7, 3, 200.00),
(24, 7, 9, 25.00),
(25, 7, 13, 1.00),
(26, 7, 14, 1.00),
(27, 8, 7, 6.00),
(28, 8, 2, 200.00),
(29, 8, 4, 15.00),
(30, 8, 13, 1.00),
(31, 8, 14, 1.00),
(32, 9, 8, 5.00),
(33, 9, 2, 180.00),
(34, 9, 4, 15.00),
(35, 9, 12, 1.00),
(36, 10, 11, 50.00),
(37, 10, 2, 200.00),
(38, 10, 4, 15.00),
(39, 10, 13, 1.00),
(40, 10, 14, 1.00),
(41, 11, 15, 1.00),
(42, 12, 16, 1.00),
(43, 13, 1, 18.00),
(44, 13, 2, 160.00),
(45, 13, 6, 30.00),
(46, 13, 13, 1.00);

-- ---------------------------------------------------------------------
-- Initial Data: Orders (Past 7 Days + Today)
-- ---------------------------------------------------------------------
INSERT INTO orders (id, order_no, user_id, total, created_at) VALUES
(1,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 6 DAY), '%Y%m%d'), '-0001'), 1, 510.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 6 DAY), ' 08:32:15')),
(2,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 6 DAY), '%Y%m%d'), '-0002'), 2, 175.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 6 DAY), ' 14:15:40')),
(3,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), '%Y%m%d'), '-0001'), 2, 305.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), ' 09:12:00')),
(4,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), '%Y%m%d'), '-0002'), 1, 455.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), ' 11:45:22')),
(5,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), '%Y%m%d'), '-0003'), 3, 165.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), ' 16:20:10')),
(6,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), '%Y%m%d'), '-0001'), 2, 350.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 08:50:33')),
(7,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), '%Y%m%d'), '-0002'), 3, 330.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 13:10:45')),
(8,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), '%Y%m%d'), '-0003'), 1, 500.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 17:35:12')),
(9,  CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), '%Y%m%d'), '-0001'), 2, 355.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 09:05:18')),
(10, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), '%Y%m%d'), '-0002'), 2, 315.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 12:22:04')),
(11, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), '%Y%m%d'), '-0003'), 3, 310.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 15:40:50')),
(12, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '%Y%m%d'), '-0001'), 1, 470.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 08:44:20')),
(13, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '%Y%m%d'), '-0002'), 2, 485.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 11:30:15')),
(14, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '%Y%m%d'), '-0003'), 3, 240.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 14:55:00')),
(15, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d'), '-0001'), 2, 425.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 09:18:22')),
(16, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d'), '-0002'), 2, 515.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 12:40:11')),
(17, CONCAT('ORD-', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d'), '-0003'), 1, 495.00, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 16:15:30')),
(18, CONCAT('ORD-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-0001'), 2, 410.00, CONCAT(CURDATE(), ' 08:15:00')),
(19, CONCAT('ORD-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-0002'), 1, 455.00, CONCAT(CURDATE(), ' 10:30:25')),
(20, CONCAT('ORD-', DATE_FORMAT(CURDATE(), '%Y%m%d'), '-0003'), 2, 335.00, CONCAT(CURDATE(), ' 13:45:10'));

-- ---------------------------------------------------------------------
-- Initial Data: Order Items
-- ---------------------------------------------------------------------
INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(1,  1, 3, 2, 160.00, 320.00),
(2,  1, 11, 2, 95.00, 190.00),
(3,  2, 1, 1, 110.00, 110.00),
(4,  2, 12, 1, 65.00, 65.00),
(5,  3, 4, 1, 165.00, 165.00),
(6,  3, 2, 1, 140.00, 140.00),
(7,  4, 7, 2, 180.00, 360.00),
(8,  4, 11, 1, 95.00, 95.00),
(9,  5, 8, 1, 165.00, 165.00),
(10, 6, 1, 2, 110.00, 220.00),
(11, 6, 12, 2, 65.00, 130.00),
(12, 7, 5, 1, 170.00, 170.00),
(13, 7, 3, 1, 160.00, 160.00),
(14, 8, 10, 2, 155.00, 310.00),
(15, 8, 11, 2, 95.00, 190.00),
(16, 9, 6, 2, 130.00, 260.00),
(17, 9, 11, 1, 95.00, 95.00),
(18, 10, 4, 1, 165.00, 165.00),
(19, 10, 9, 1, 150.00, 150.00),
(20, 11, 7, 1, 180.00, 180.00),
(21, 11, 12, 2, 65.00, 130.00),
(22, 12, 2, 2, 140.00, 280.00),
(23, 12, 11, 2, 95.00, 190.00),
(24, 13, 3, 2, 160.00, 320.00),
(25, 13, 8, 1, 165.00, 165.00),
(26, 14, 6, 1, 130.00, 130.00),
(27, 14, 1, 1, 110.00, 110.00),
(28, 15, 4, 2, 165.00, 330.00),
(29, 15, 11, 1, 95.00, 95.00),
(30, 16, 7, 2, 180.00, 360.00),
(31, 16, 10, 1, 155.00, 155.00),
(32, 17, 9, 2, 150.00, 300.00),
(33, 17, 12, 3, 65.00, 195.00),
(34, 18, 1, 2, 110.00, 220.00),
(35, 18, 11, 2, 95.00, 190.00),
(36, 19, 3, 1, 160.00, 160.00),
(37, 19, 8, 1, 165.00, 165.00),
(38, 19, 12, 2, 65.00, 130.00),
(39, 20, 4, 1, 165.00, 165.00),
(40, 20, 5, 1, 170.00, 170.00);

-- ---------------------------------------------------------------------
-- Initial Data: Waste Records
-- ---------------------------------------------------------------------
INSERT INTO waste_records (id, ingredient_id, quantity, reason, notes, user_id, created_at) VALUES
(1, 2, 250.00, 'spill', 'Accidental milk pitcher knock over during rush', 2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 09:40:00')),
(2, 11, 80.00, 'spoilage', 'Strawberries softened and spoiled in container', 1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 08:20:00')),
(3, 15, 2.00, 'prep_error', 'Burnt croissants left in oven too long', 2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 07:45:00')),
(4, 10, 120.00, 'spoilage', 'Cream separated and sour smell detected', 1, CONCAT(CURDATE(), ' 08:10:00')),
(5, 1, 36.00, 'other', 'Grinder burr dial-in and calibration waste', 1, CONCAT(CURDATE(), ' 07:30:00'));

SET FOREIGN_KEY_CHECKS = 1;
