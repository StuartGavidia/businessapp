-- create industries
INSERT INTO industries (name) VALUES ('Restaurant'), ('Construction');

-- create companies
INSERT INTO companies (name, industry_id, company_code) VALUES
('All You Can Eat Buffet', (SELECT id FROM industries WHERE name='Restaurant'), "ABCDEF1"),
('Titan Builders', (SELECT id FROM industries WHERE name='Construction'), "ABCDEF2");

-- create features
INSERT INTO features (name, description, industry_id) VALUES
('Analytics', 'Showing analytical trends for companies', NULL),
('Communication', 'Messaging channel for all users', NULL),
('Calendar', 'Supporting scheduling and looking at calendar', NULL),
('Build Projects', 'Sample Build Feature', (SELECT id FROM industries WHERE name='Construction')),
('Recipes', 'Sample Reciped Feature', (SELECT id FROM industries WHERE name='Restaurant'));

-- enable features for companies
INSERT INTO company_features (company_id, feature_id, enabled)
SELECT c.id, f.id, TRUE FROM companies c, features f
WHERE (f.industry_id IS NULL OR f.industry_id = c.industry_id);

-- create permissions
INSERT INTO permissions (name, description) VALUES
('Can View Analytics', 'User can view the analytics feature'),
('Can Assign Analytics', 'User can assign the analytics viewing to subordinates'),
('Can Revoke Analytics', 'User can revoke the analytics viewing from subordinates'),
('Can View Communication', 'User can view the communication feature'),
('Can Assign Communication', 'User can assign the communication viewing to subordinates'),
('Can Revoke Communication', 'User can revoke the communication viewing from subordinates'),
('Can View Calendar', 'User can view the calendar feature'),
('Can Assign Calendar', 'User can assign the calendar viewing to subordinates'),
('Can Revoke Calendar', 'User can revoke the calendar viewing from subordinates'),
('Can View Build Projects', 'User can view the build projects feature'),
('Can Assign Build Projects', 'User can assign the build projects viewing to subordinates'),
('Can Revoke Build Projects', 'User can revoke the build projects viewing from subordinates'),
('Can View Recipes', 'User can view the recipes feature'),
('Can Assign Recipes', 'User can assign the recipes viewing to subordinates'),
('Can Revoke Recipes', 'User can revoke the recipes viewing from subordinates');

-- Insert predefined roles
INSERT INTO roles (name, description) VALUES
('CEO', 'Chief Executive Officer with full access to all features'),
('Manager', 'Can manage direct reports and their permissions'),
('Employee', 'Standard employee with basic access rights');

-- insert the users
-- The password_hash is encrypted with Flask_BCrypt and the password is 'password'
-- insert the CEOs
INSERT INTO users (first_name, last_name, username, email, password_hash, position_name, manager_id, company_id, status, manager_code) VALUES
('John', 'Doe', 'johndoe', 'john@buffet.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'CEO', NULL, (SELECT id FROM companies WHERE name='All You Can Eat Buffet'), 'Active', 'MNG123'), -- CEO of Buffet
('Bob', 'Builder', 'bobbuilder', 'bob@titan.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'CEO', NULL, (SELECT id FROM companies WHERE name='Titan Builders'), 'Active', 'MNG789'); -- CEO of Titan Builders
SET @manager1_id = (SELECT id FROM users WHERE username='johndoe');
SET @manager3_id = (SELECT id FROM users WHERE username='bobbuilder');

-- update companies with ceo_id
UPDATE companies
SET ceo_id = (
    SELECT id FROM users
    WHERE company_id = companies.id AND position_name = 'CEO'
);

-- insert the managers
INSERT INTO users (first_name, last_name, username, email, password_hash, position_name, manager_id, company_id, status, manager_code) VALUES
('Jane', 'Smith', 'janesmith', 'jane@buffet.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Manager', @manager1_id, (SELECT id FROM companies WHERE name='All You Can Eat Buffet'), 'Active', 'MNG456'); -- Manager at Buffet
SET @manager2_id = (SELECT id FROM users WHERE username='janesmith');

-- insert the employees
INSERT INTO users (first_name, last_name, username, email, password_hash, position_name, manager_id, company_id, status, manager_code) VALUES
('Jim', 'Bean', 'jimbean', 'jim@buffet.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Chef', @manager2_id, (SELECT id FROM companies WHERE name='All You Can Eat Buffet'), 'Active', NULL), -- Employee at Buffet
('Jill', 'Johnson', 'jilljohnson', 'jill@buffet.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Cashier', @manager2_id, (SELECT id FROM companies WHERE name='All You Can Eat Buffet'), 'Active', NULL), -- Employee at Buffet
('Bill', 'Barn', 'billbarn', 'bill@titan.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Foreman', @manager3_id, (SELECT id FROM companies WHERE name='Titan Builders'), 'Active', NULL); -- Employee at Titan Builders

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
SELECT id, (SELECT id FROM roles WHERE name = 'CEO') FROM users WHERE position_name = 'CEO';
INSERT INTO user_roles (user_id, role_id)
SELECT id, (SELECT id FROM roles WHERE name = 'Manager') FROM users WHERE position_name = 'Manager';
INSERT INTO user_roles (user_id, role_id)
SELECT id, (SELECT id FROM roles WHERE name = 'Employee') FROM users WHERE position_name IN ('Chef', 'Cashier', 'Foreman');

-- assign permissions to CEO
-- NOTE: lets not worry about permissions for other employees for now, but eventually managers should be able to update that themselves
INSERT INTO user_permissions (user_id, permission_id, granted)
SELECT u.id, p.id, TRUE
FROM users u, permissions p
WHERE u.position_name = 'CEO' AND (p.name LIKE 'Can View%' OR p.name LIKE 'Can Assign%' OR p.name LIKE 'Can Revoke%');
