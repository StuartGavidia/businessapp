-- Delete existing records
DELETE FROM users WHERE role='Employee';
DELETE FROM users WHERE role='Manager';

-- Add managers
INSERT INTO users (username, email, password_hash, role, manager_id, manager_code) VALUES
('manager1', 'manager1@example.com', 'somehash', 'Manager', NULL, 'M1'),
('manager2', 'manager2@example.com', 'somehash', 'Manager', NULL, 'M2');

-- Retrieve the IDs of the newly inserted managers
SET @manager1_id = (SELECT id FROM users WHERE username='manager1');
SET @manager2_id = (SELECT id FROM users WHERE username='manager2');

-- Add employees
INSERT INTO users (username, email, password_hash, role, manager_id, manager_code) VALUES
('employee1', 'employee1@example.com', 'somehash', 'Employee', @manager1_id, NULL),
('employee2', 'employee2@example.com', 'somehash', 'Employee', @manager2_id, NULL),
('employee3', 'employee3@example.com', 'somehash', 'Employee', @manager2_id, NULL);