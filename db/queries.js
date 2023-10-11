const mysql = require('mysql2/promise');

let connection;

const initDBConnection = async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mypassword',
        database: 'employee_tracker'
    });
};

const closeDBConnection = () => {
    if (connection) {
        connection.end();
    }
};

// Define your query functions below

const viewAllDepartments = async () => {
    const [rows] = await connection.execute('SELECT * FROM department');
    return rows;
};

const viewAllRoles = async () => {
    const [rows] = await connection.execute(`
        SELECT role.id, role.title, role.salary, department.name AS department 
        FROM role 
        JOIN department ON role.department_id = department.id
    `);
    return rows;
};

const viewAllEmployees = async () => {
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
};

// More queries as per your requirement...

module.exports = {
    initDBConnection,
    closeDBConnection,
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees
    // Export other query functions as needed
};
