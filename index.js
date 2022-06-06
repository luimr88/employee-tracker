const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

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
                'Add a department',
                'Add a role' 
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
            case 'Add a role':
                addRole();
                break;
        }
    });
}

function viewDepartments() {
    const sql = `SELECT department.id, department.name AS Department
    FROM department;`

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        openingPrompt();
    })
};

function viewRoles() {
    const sql = `SELECT roles.id, roles.title AS role, roles.salary, department.name AS department
    FROM roles
    INNER JOIN department ON (department.id = roles.department_id);`;

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        openingPrompt();
    })
};

function viewEmployees() {
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
        openingPrompt();
    })
}

function listByDepartment() {
    const sql2 = `SELECT * FROM department`;
    db.execute(sql2, (err, response) => {
        departmentList = response.map(departments => {
            return departments;
        })
        return inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department do you want to sort employees by?:',
                choices: departmentList
            }
        ]).then((answer) => {
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            LEFT JOIN employee manager on manager.id = employee.manager_id
            INNER JOIN roles ON (roles.id = employee.role_id)
            INNER JOIN department ON (department.id = roles.department_id)
            WHERE department.name = '${answer.department}'
            ORDER BY employee.id;`
    
            db.query(sql, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(res);
                openingPrompt();
            });
        });
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
        const sql = `INSERT INTO department(name)
        VALUES('${answer.department}');`
    
        db.query(sql, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            viewDepartments();
        });
    });
};

function addRole() {
    const sql2 = `SELECT * FROM department`;
    db.query(sql2, function (error, response) {
        departmentList = response.map(departments => ({
            name: departments.name,
            value: departments.id
        }))
        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role you want to add:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter a title!');
                        return false
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the role you want to add:',
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log('Please enter a salary!');
                        return false
                    }
                } 
            },
            {
                type: 'list',
                name: 'department',
                message: 'Select the department to which the role belongs to:',
                choices: departmentList
            }
        ]).then((answers) => {
            const sql = `INSERT INTO roles SET title='${answers.title}', salary= ${answers.salary}, department_id= ${answers.department};`
            db.query(sql, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                viewRoles();
            });
        });
    })
}

openingPrompt();

