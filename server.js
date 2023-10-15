const { viewAllDepartments, initDBConnection, viewAllEmployees } = require('./public/js/queries');
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
        process.exit();
    }
};

init();
