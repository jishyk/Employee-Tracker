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
                case 'View all employees':
                    const employees = await viewAllEmployees();
                    console.table(employees);
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
                    const departmentChoices = departmentsForRole.map(dept => ({
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
                            choices: departmentChoices
                        }
                    ]);

                    await addRole(newRole.title, parseFloat(newRole.salary), newRole.departmentId);
                    console.log("Role added successfully!");
                    break;

                case 'Add an employee':
                    const rolesForEmployee = await viewAllRoles();
                    const roleChoicesForEmployee = rolesForEmployee.map(role => ({
                            name: role.title,
                            value: role.id
                        }));
    
                    const newEmployee = await inquirer.prompt([
                            {
                                type: 'input',
                                name: 'firstName',
                                message: 'Enter the first name of the employee:'
                            },
                            {
                                type: 'input',
                                name: 'lastName',
                                message: 'Enter the last name of the employee:'
                            },
                            {
                                type: 'list',
                                name: 'roleId',
                                message: 'Which role does this employee have?',
                                choices: roleChoicesForEmployee
                            },
                        ]);
    
                        await addEmployee(newEmployee.firstName, newEmployee.lastName, newEmployee.roleId, newEmployee.managerId);
                        console.log("Employee added successfully!");
                        break;

                case 'Update an employee role':
                    const employeesToUpdate = await viewAllEmployees();
                    const employeeChoicesToUpdate = employeesToUpdate.map(emp => ({
                         name: `${emp.first_name} ${emp.last_name}`,
                         value: emp.id
                     }));
                    const rolesForUpdate = await viewAllRoles();
                    const roleChoicesForUpdate = rolesForUpdate.map(role => ({
                         name: role.title,
                         value: role.id
                     }));
                    const { employeeIdToUpdate } = await inquirer.prompt({
                         type: 'list',
                         name: 'employeeIdToUpdate',
                         message: 'Which employee\'s role do you want to update?',
                         choices: employeeChoicesToUpdate
                    });
                    const { newRoleId } = await inquirer.prompt({
                        type: 'list',
                        name: 'newRoleId',
                        message: 'Select the new role for the selected employee:',
                        choices: roleChoicesForUpdate
                    });
                    await updateEmployeeRole(employeeIdToUpdate, newRoleId);
                    console.log("Employee's role updated successfully!");
                    break;
                case 'Exit':
                    exitApp = true;
                    break;
                default:
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
