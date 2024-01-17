-- sample init
CREATE TABLE budget (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_name VARCHAR(255) UNIQUE NOT NULL,
    allowance INT NOT NULL,
    occurance INT NOT NULL,
    budget_date DATETIME NOT NULL

);  
