-- Delete existing records
DELETE FROM users WHERE role='Employee';
DELETE FROM users WHERE role='Manager';

-- Add managers
-- The password_hash is encrypted with Flask_BCrypt and the password is 'password'
INSERT INTO users (first_name, last_name, username, email, password_hash, role, manager_id, manager_code) VALUES
('Boss', 'Man', 'manager1', 'manager1@example.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Manager', NULL, 'M1'),
('Jeff', 'Bezos', 'manager2', 'manager2@example.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Manager', NULL, 'M2');

-- Retrieve the IDs of the newly inserted managers
SET @manager1_id = (SELECT id FROM users WHERE username='manager1');
SET @manager2_id = (SELECT id FROM users WHERE username='manager2');

-- Add employees
INSERT INTO users (first_name, last_name, username, email, password_hash, role, manager_id, manager_code) VALUES
('Random', 'Person', 'employee1', 'employee1@example.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Employee', @manager1_id, NULL),
('Lebron', 'James', 'employee2', 'employee2@example.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Employee', @manager2_id, NULL),
('Lionel', 'Messi', 'employee3', 'employee3@example.com', '$2b$12$y2SobP.HfI2V9m1SGZyi/uocn615knMMG.pkcb6aj4NlGtiGCYsya', 'Employee', @manager2_id, NULL);