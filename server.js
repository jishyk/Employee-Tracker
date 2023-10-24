const { initDBConnection, closeDBConnection, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./public/js/queries');
const inquirer = require('inquirer');
const { mainMenu } = require('./prompts');
require('dotenv').config();

const init = async () => {
    try {
        await initDBConnection();
        let exitApp = false;

        while (!exitApp) {
            const { action } = await mainMenu();

            switch (action) {
                case 'View all departments':
                    const departments = await viewAllDepartments();
                    console.table(departments);
                    break;
                case 'View all roles':
                    const roles = await viewAllRoles();
                    console.table(roles);
                    break;
                case 'Add a department':
                    const { departmentName } = await inquirer.prompt({
                        type: 'input',
                        name: 'departmentName',
                        message: 'Enter the name of the new department:',
                    });

                    if (!departmentName.trim()) {
                        console.log("Department name cannot be empty.");
                        break;
                    }

                    await addDepartment(departmentName);
                    console.log(`Added ${departmentName} to departments!`);
                    break;
                case 'Add a role':
                    const departmentsForRole = await viewAllDepartments();
                    const departmentChoicesForRole = departmentsForRole.map(dept => ({
                        name: dept.name,
                        value: dept.id
                    }));

                    const newRole = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'Enter the title of the role:'
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Enter the salary for the role:',
                            validate: salary => {
                                const salaryNum = parseFloat(salary);
                                if (isNaN(salaryNum)) return "Please enter a valid number";
                                return true;
                            }
                        },
                        {
                            type: 'list',
                            name: 'departmentId',
                            message: 'Which department does this role belong to?',
                            choices: departmentChoicesForRole
                        }
                    ]);

                    await addRole(newRole.title, parseFloat(newRole.salary), newRole.departmentId);
                    console.log("Role added successfully!");
                    break;
                case 'Update an employee role':
                    await updateEmployeeRole();
                    break;
                case 'View all employees':
                    const employees = await viewAllEmployees();
                    console.table(employees);
                    break;
                case 'Exit':
                    exitApp = true;
                    break;
                default:
                    console.log(`Action: ${action} is not yet implemented`);
            }
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        closeDBConnection();
        process.exit();
    }
};

init();
