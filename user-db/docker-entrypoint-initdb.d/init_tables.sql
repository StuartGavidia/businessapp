-- here we have the industries that exist and we will support
CREATE TABLE industries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- here we have the companies that have access to the application
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    company_code VARCHAR(10) UNIQUE NOT NULL,
    industry_id INT,
    FOREIGN KEY (industry_id) REFERENCES industries(id)
);

-- here we have all the users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    position_name VARCHAR(50) NOT NULL,
    manager_code VARCHAR(10) UNIQUE,
    manager_id INT,
    company_id INT NOT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    FOREIGN KEY (manager_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- here we update the companies table to reference users table for CEO
ALTER TABLE companies
ADD COLUMN ceo_id INT,
ADD FOREIGN KEY (ceo_id) REFERENCES users(id);

-- here we store all the different features that the app will spport
CREATE TABLE features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    industry_id INT,
    FOREIGN KEY (industry_id) REFERENCES industries(id)
);

-- here we link the features that a company will have
CREATE TABLE company_features (
    company_id INT,
    feature_id INT,
    enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (feature_id) REFERENCES features(id),
    PRIMARY KEY(company_id, feature_id)
);

-- here we store the permissions available
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL
);

-- here we link the permission status for users
CREATE TABLE user_permissions (
    user_id INT,
    permission_id INT,
    granted BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    PRIMARY KEY(user_id, permission_id)
);