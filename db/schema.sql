CREATE DATABASE IF NOT EXISTS employeetrack_db;
USE employeetrack_db;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
INSERT INTO department (name) VALUES ('HR'), ('Engineering'), ('Finance');
INSERT INTO role (title, salary, department_id) VALUES ('Manager', 70000, 1), ('Engineer', 80000, 2), ('Accountant', 60000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Smith', 2, 1), ('Jim', 'Beam', 3, 1);

ALTER TABLE department ADD UNIQUE (name);
ALTER TABLE role ADD UNIQUE (title, salary, department_id);
ALTER TABLE employee ADD UNIQUE (first_name, last_name, role_id, manager_id);
