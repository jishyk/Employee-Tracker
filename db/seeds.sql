USE employee_tracker;

INSERT INTO department (name) VALUES 
('HR'),
('Engineering'),
('Finance');

INSERT INTO role (title, salary, department_id) VALUES 
('Manager', 70000, 1),
('Engineer', 80000, 2),
('Accountant', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Jim', 'Beam', 3, 1);
