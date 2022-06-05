const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

function postPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'intro',
            message: 'Please select an option:',
            choices:[
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department' 
            ]
        }
    ])
    .then((answer) => {
        switch(answer.intro) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
        }
    });
}

function viewAllEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN roles ON (roles.id = employee.role_id)
    INNER JOIN department ON (department.id = roles.department_id)
    ORDER BY employee.id;`

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        postPrompt();
    })
};

function viewAllDepartments() {
    const sql = `SELECT department.id, department.name AS Department
    FROM department;`

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        postPrompt();
    })
};

function viewAllRoles() {
    const sql = `SELECT roles.id, roles.title AS role, roles.salary, department.name AS department
    FROM roles
    INNER JOIN department ON (department.id = roles.department_id);`;

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        postPrompt();
    })
};

function viewByDepartment(department) {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN roles ON (roles.id = employee.role_id)
    INNER JOIN department ON (department.id = roles.department_id)
    WHERE department.name = '${department}'
    ORDER BY employee.id;`

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        postPrompt();
    });
};

function addDepartment(department) {
    const sql = `INSERT INTO department(name)
    VALUES('${department}');`

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        viewAllDepartments();
    });
};

module.exports = {viewAllEmployees, viewAllDepartments, viewAllRoles, viewByDepartment, addDepartment};