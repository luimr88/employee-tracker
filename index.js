const inquirer = require('inquirer');
const {
    viewAllEmployees, 
    viewAllDepartments, 
    viewAllRoles, 
    viewByDepartment, 
    addDepartment
} = require('./utils/path');
const departmentList = ['DRIVERS', 'ENGINEERING', 'MARKETING', 'LOGISTICS'];

function openingPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'intro',
            message: 'Please select an option:',
            choices:[
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by department',
                'Add a department' 
            ]
        }
    ])
    .then((answer) => {
        switch(answer.intro) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'View employees by department':
                listByDepartment();
                break;
            case 'Add a department':
                addNewDepartment();
                break;
        }
    });
}

function viewDepartments() {
    viewAllDepartments();
    console.log('loaded');
};

function viewRoles() {
    viewAllRoles();
    console.log('loaded');
};

function viewEmployees() {
    viewAllEmployees();
    console.log('loaded');
}

function listByDepartment() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Which department do you want to sort employees by?:',
            choices: departmentList
        }
    ]).then((answer) => {
        addDepartment(answer.department);
    });
}

function addNewDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Please enter the department you want to add:',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a department!');
                    return false
                }
            }
        }
    ]).then((answer) => {
        departmentList.push(answer.department);
        addDepartment(answer.department);
    });
}

openingPrompt();

