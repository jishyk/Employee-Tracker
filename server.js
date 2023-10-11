const { viewAllDepartments } = require('./db/queries');
const { mainMenu } = require('./prompts');

const init = async () => {
    let exitApp = false;
    while (!exitApp) {
        const { action } = await mainMenu();
        switch (action) {
            case 'View all departments':
                const [departments] = await viewAllDepartments();
                console.table(departments);
                break;
            case 'Exit':
                exitApp = true;
                break;
            // More cases for other actions...
            default:
                console.log(`Action: ${action} is not yet implemented`);
        }
    }
    process.exit();
};

init();
