const db = require('../db/connection');

const viewAllEmployees = () => {
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
    })
}