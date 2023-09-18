CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    role ENUM('Manager', 'Employee') NOT NULL,
    manager_code VARCHAR(10),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);