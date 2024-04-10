-- sample init
CREATE TABLE budget (
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    company_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) UNIQUE NOT NULL,
    allowance INT NOT NULL,
    occurance INT NOT NULL,
    budget_date DATETIME NOT NULL,
    budget_active BOOLEAN NOT NULL
);  

CREATE TABLE stripe_account (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id VARCHAR(255) UNIQUE NOT NULL,
    customer_id VARCHAR(255) UNIQUE NOT NULL,
    account_id VARCHAR(225) UNIQUE
);

CREATE TABLE regular_transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    budget_id INT NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    descriptions VARCHAR (255) NOT NULL
);

CREATE TABLE income_transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    company_id VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    descriptions VARCHAR (255) NOT NULL,
    transaction_date DATETIME NOT NULL
)