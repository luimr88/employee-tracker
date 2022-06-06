const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

function openingPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            pageSize:10,
            name: 'intro',
            message: 'Please select an option:',
            choices:[
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by department',
                'View employees by manager',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update employee role',
                'Exit'
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
            case 'View employees by manager':
                viewEmployeeManager()
                break;
            case 'Add a department':
                addNewDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update employee role':
                updateEmployee();
                break;
            case 'Exit':
                endPrompt();
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
        console.log(' ');
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
        console.log(' ');
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
        console.log(' ');
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
                console.log(' ');
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
        //departmentList.push(answer.department);
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
    db.query(sql2, (error, response) => {
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

function addEmployee() {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (error, response) => {
        employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }))
        const sql3 = `SELECT * FROM roles`;
        db.query(sql3, (error, response) => {
            roleList = response.map(roles => ({
                name: roles.title,
                value: roles.id
            }))
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: 'Enter the first name of the employee:',
                    validate: input => {
                        if (input) {
                            return true;
                        } else {
                            console.log('Please enter a first name!');
                            return false
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'last',
                    message: 'Enter the last name of the employee:',
                    validate: input => {
                        if (input) {
                            return true;
                        } else {
                            console.log('Please enter a last name!');
                            return false
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What role does the employee have?',
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the manager of the employee?',
                    choices: employeeList
                }
            ]).then((answers) => {
                const sql = `INSERT INTO employee SET first_name='${answers.first}', last_name= '${answers.last}', role_id= ${answers.role}, manager_id=${answers.manager};`
                db.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    viewEmployees();
                });
            });
        });
    });
};

function updateEmployee() {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (error, response) => {
        employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }))
        const sql3 = `SELECT * FROM roles`;
        db.query(sql3, (error, response) => {
            roleList = response.map(roles => ({
                name: roles.title,
                value: roles.id
            }))
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What new role do want to assign to this employee?',
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who will be the employees manager?',
                    choices: employeeList
                },
                
            ]).then((answers) => {
                const sql = `UPDATE employee SET role_id= ${answers.role}, manager_id=${answers.manager} WHERE id =${answers.employee};`
                db.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    viewEmployees();
                });
            });
        });
    });
};

function viewEmployeeManager() {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (error, response) => {
        managerList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }))
        return inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager would you like to sort employees by?',
                choices: managerList
            }
        ]).then((answers) => {
            const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            LEFT JOIN employee manager on manager.id = employee.manager_id
            INNER JOIN roles ON (roles.id = employee.role_id)
            INNER JOIN department ON (department.id = roles.department_id)
            WHERE manager.id = ${answers.manager}
            ORDER BY employee.id;`
            db.query(sql, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(' ');
                console.table(res);
                openingPrompt();
            });
        });
    });
}

function endPrompt() {
    process.exit(0);
};
openingPrompt();

