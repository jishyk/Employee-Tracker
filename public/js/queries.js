const mysql = require('mysql2/promise');


let connection;

const initDBConnection = async () => {
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Connected to the database.');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};
const closeDBConnection = () => {
    if (connection) {
        connection.end();
    }
};

const viewAllDepartments = async () => {
    try {
        const [rows] = await connection.execute('SELECT * FROM department');
        return rows;
    } catch (err) {
        console.error('Error fetching departments:', err);
    }
};
const viewAllRoles = async () => {
    try {
        const [rows] = await connection.execute(`
            SELECT role.id, role.title, role.salary, department.name AS department 
            FROM role 
            JOIN department ON role.department_id = department.id
        `);
        return rows;
    } catch (err) {
        console.error('Error fetching roles:', err);
    }
};
const viewAllEmployees = async () => {
    try {
        const [rows] = await connection.execute(`
            SELECT employee.id, employee.first_name, employee.last_name, 
                   role.title, department.name AS department, role.salary, 
                   CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON employee.manager_id = manager.id
        `);
        return rows;
    } catch (err) {
        console.error('Error fetching employees:', err);
    }
};

const addDepartment = async (departmentName) => {

    try {
        await connection.execute('INSERT INTO department (name) VALUES (?)', [departmentName]);
    } catch (error) {
        console.error('Error adding the department:', error);
    }
};
const addRole = async (title, salary, department_id) => {
    try {
        const [result] = await connection.execute(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [title, salary, department_id]
        );
        return result;
    } catch (err) {
        console.error('Error adding role:', err);
    }
};
const addEmployee = async (first_name, last_name, role_id, manager_id = null) => {
    try {
        const [result] = await connection.execute(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [first_name, last_name, role_id, manager_id]
        );
        return result;
    } catch (err) {
        console.error('Error adding employee:', err);
    }
};
const updateEmployeeRole = async (employee_id, new_role_id) => {
    if (!employee_id || !new_role_id) {
        throw new Error('Employee ID or Role ID is not defined.');
    }

    try {
        const [result] = await connection.execute(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [new_role_id, employee_id]
        );
        return result;
    } catch (err) {
        console.error('Error updating employee role:', err);
    }
};


module.exports = {
    initDBConnection,
    closeDBConnection,
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
};
