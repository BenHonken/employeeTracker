const cTable = require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Rootpassword",
    database: "employees"
});
const menu = ["View all employees", "View employees by department", "View employees by manager", "Add employee", "Remove Employee", "Update employee role", "Update employee manager", "Add Manager", "Add role", "Remove role"]
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

addDepartment = function(answer) {
    connection.query("INSERT INTO department (name) VALUES (?)", [answer.name], function(err, result) {
        if (err) throw err;
    })
};
addRole = function(answer) {
    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?)", [answer.data], function(err, result) {
        if (err) throw err;
    })
};
addEmployee = function(answer) {
    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)", [answer.data], function(err, result) {
        if (err) throw err;
    })
};
addManager = function(answer) {
    connection.query("INSERT INTO manager (employee_id) VALUES (?)", [answer.id], function(err, result) {
        if (err) throw err;
    
    })
};
getEmployees = function() {
    connection.query("SELECT * FROM employee", function(err, result) {
        if (err) throw err;
        return result;
    })
};
getEmployeesByDepartment = function(answer) {
    connection.query("SELECT * FROM employee WHERE department_id = (?)", [answer.id], function(err, result) {
        if (err) throw err;
        console.table(result);
    })
};
getEmployeesByManager = function(answer) {
    connection.query("SELECT * FROM employee WHERE manager_id = (?)", [answer.id], function(err, result) {
        if (err) throw err;
        console.table(result);
    })
};
updateEmployeeManager = function(answer) {
    connection.query("UPDATE employee SET manager_id = ? WHERE id=(?)", [answer.manager, answer.id], function(err, result) {
        if (err) throw err;
    
    })
};
updateEmployeeRole = function(answer) {
    connection.query("UPDATE employee SET role_id = ? WHERE id=(?)", [answer.role, answer.id], function(err, result) {
        if (err) throw err;
    
    })
};
removeEmployee = function(answer) {
    connection.query("REMOVE FROM employee WHERE id= (?)", [answer.id], function(err, result) {
        if (err) throw err;
    
    })
};
removeRole = function(answer) {
    connection.query("REMOVE FROM role WHERE id= (?)", [answer.id], function(err, result) {
        if (err) throw err;
    
    })
};
getRoles = function() {
    connection.query("SELECT * FROM role", function(err, result) {
        if (err) throw err;
        return result;
    })
};
getManagers = function() {
    connection.query("SELECT employee.first_name, employee.first_name FROM employee INNER JOIN managers ON employee.id=manager.employee_id", function(err, result) {
        if (err) throw err;
        return result;
    })
}
getDepartments = function() {
    connection.query("SELECT * FROM department", function(err, result){
        if (err) throw err;
        return result;
    })
}
//view all employees, employees by manager, employees by department
//add employee, update manager, update role
//view all roles, add role, remove role
async function mainPrompt() {
    return inquirer.prompt(
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: menu
        }
    );
}
async function addDepartmentQuery() {
    return inquirer.prompt(
        {
            type: "input",
            name: "name",
            message: "What is the name of the department?"
        }
    );
}
async function addRoleQuery() {
    return inquirer.prompt(
        {
            type: "input",
            name: "name",
            message: "What is the name of the role?"
        }
    );
}
async function addManagerQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which employee would you like to make a manager?",
            choices: getEmployees()
        }
    );
}
async function addEmployeeQuery() {
    return inquirer.prompt(
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee?"
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the role of the employee?",
            choices: getRoles()
        },
        {
            type: "list",
            name: "manager_id",
            message: "What is the role of the employee?",
            choices: getManagers()
        },
    );
}
async function getByDepartmentQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which department would you like to view?",
            choices: getDepartments()
        }
    );
}
async function getByManagerQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which manager's employees would you like to view?",
            choices: getManagers()
        }
    );
}
async function updateManagerQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "id",
            message: "Which employee would you like to update?",
            choices: getEmployees()
        },
        {
            type: "list",
            name: "manager",
            message: "Which manager would you like to assign?",
            choices: getManagers()
        }
    );
}
async function updateRoleQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "id",
            message: "Which employee would you like to update?",
            choices: getEmployees()
        },
        {
            type: "list",
            name: "role",
            message: "Which role would you like to assign?",
            choices: getRoles()
        }
    );
}
async function removeEmployeeQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which employee would you like to remove?",
            choices: getEmployees()
        }
    );
}
async function removeRoleQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which role would you like to remove?",
            choices: getManagers()
        }
    );
}
//const menu = [0, "View employees by department", "View employees by manager", "Add employee", "Remove Employee", "Update employee role", "Update employee manager", "Add Manager", "Add role", "Remove role"]
async function init() {
    let first = await mainPrompt();
    if (first.choice === menu[0]){
        await console.table(getEmployees());
    }
    else if (first.choice === menu[1]){
        let answer = getByDepartmentQuery();
        console.log(answer.name);
    }
    else if (first.choice === menu[2]){
        
    }
    else if (first.choice === menu[3]){
        
    }
    else if (first.choice === menu[4]){
        
    }
    else if (first.choice === menu[5]){
        
    }
    else if (first.choice === menu[6]){
        
    }
    else if (first.choice === menu[7]){
        
    }
    else if (first.choice === menu[8]){
        
    }
    else if (first.choice === menu[9]){
        
    }
    init();
}
init();