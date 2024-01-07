-- sample init
CREATE TABLE budget (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    allowance INT NOT NULL,
    budget_date DATETIME

);  
