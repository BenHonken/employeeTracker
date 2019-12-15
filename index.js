const cTable = require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");
let employeeArray = [];
let roleArray = [];
let departmentArray = [];
let managerArray = [];
let employeeIdArray = [];
let roleIdArray = [];
let departmentIdArray = [];
let managerIdArray = [];
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Rootpassword",
    database: "employees"
});
const menu = ["View all employees", "View employees by department", "View employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager", "Add manager", "Remove manager", "View roles", "Add role", "Remove role", "View departments", "Add department", "Remove department"]
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
    let managerId;
    if(answer.manager != 'null') {
        managerId = managerIdArray[managerArray.indexOf(answer.manager)];
    }
    else{
        managerId=null;
    }
    let roleId = roleIdArray[roleArray.indexOf(answer.role)];
    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.first_name, answer.last_name, roleId, managerId], function(err, result) {
        if (err) throw err;
    })
    console.log(answer.first_name + " " + answer.last_name + " the " + answer.role + " was added to the database!");
};
addManager = function(answer) {
    let employeeId = employeeIdArray[employeeArray.indexOf(answer.name)];
    connection.query("INSERT INTO manager (employee_id, manager) VALUES (?, ?)", [employeeId, answer.name], function(err, result) {
        if (err) throw err;
    
    })
    console.log(answer.name + " is now a manager!")
};
getEmployees = function() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, manager.manager FROM (((employee left join role on employee.role_id=role.id) left join department on role.department_id = department.id) left join manager on employee.manager_id=manager.id) order by employee.id", function(err, result) {
        if (err) throw err;
        console.table(result);
        return result;
    })
};
getEmployeesByDepartment = function(answer) {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, manager.manager FROM (((employee left join role on employee.role_id=role.id) left join department on role.department_id = department.id) left join manager on employee.manager_id=manager.id) where department.department = ? order by employee.id", [answer.name], function(err, result) {
        if (err) throw err;
        console.table(result);
    })
};
getEmployeesByManager = function(answer) {
    connection.query("SELECT manager.id FROM manager WHERE manager.manager = ?", [answer.name], function(err, result) {
        if (err) throw err;
        connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, manager.manager FROM (((employee left join role on employee.role_id=role.id) left join department on role.department_id = department.id) left join manager on employee.manager_id=manager.id) where employee.manager_id = ?", [result[0].id], function(err, result) {
            if (err) throw err;
            console.table(result);
        })
        })
};
updateEmployeeManager = function(answer) {
    let employeeId = employeeIdArray[employeeArray.indexOf(answer.name)];
    let managerId = managerIdArray[managerArray.indexOf(answer.manager)-1];
    if (answer.manager == 'null'){
        managerId = null;
    }
    connection.query("UPDATE employee SET manager_id = ? WHERE id= ?", [managerId, employeeId], function(err, result) {
        if (err) throw err;
        else{
            console.log(answer.name + "'s role was updated!")
        }
    })
};
updateEmployeeRole = function(answer) {
    let employeeId = employeeIdArray[employeeArray.indexOf(answer.name)];
    let roleId = roleIdArray[roleArray.indexOf(answer.role)];
    connection.query("UPDATE employee SET role_id = ? WHERE id= ?", [roleId, employeeId], function(err, result) {
        if (err) throw err;
        else{
            console.log(answer.name + "'s role was updated!")
        }
    })
};
removeEmployee = function(answer) {
    let employeeId = employeeIdArray[employeeArray.indexOf(answer.name)];
    connection.query("DELETE FROM employee WHERE id= ?", [employeeId], function(err, result) {
        if (err) throw err;
        else{
            console.log(answer.name + " has been removed from the database!")
        }
    })
};
removeRole = function(answer) {
    connection.query("DELETE FROM role WHERE id= (?)", [answer.id], function(err, result) {
        if (err) throw err;
    
    })
};
removeManager = function(answer) {
    let managerId = managerIdArray[managerArray.indexOf(answer.name)];
    connection.query("DELETE FROM manager WHERE id = ?", [managerId], function(err, result) {
        if (err) throw err;
    
    })
    console.log(answer.name + " is no longer a manager.")
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
renderEmployees = function() {
    employeeArray = [];
    employeeIdArray = [];
    query = "select * from employee";
    connection.query(query,function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            employeeArray.push(`${res[i].first_name} ${res[i].last_name}`);
            employeeIdArray.push(res[i].id);
        }
    })
}
renderRoles = function() {
    roleArray = [];
    roleIdArray = [];
    query = "select * from role";
    connection.query(query,function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            roleArray.push(res[i].title);
            roleIdArray.push(res[i].id);
        }
    })
}
renderDepartments = function() {
    departmentArray = [];
    departmentIdArray = [];
    query = "select * from department";
    connection.query(query,function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            departmentArray.push(res[i].department);
            departmentIdArray.push(res[i].id);
        }
    })
}
renderManagers = function() {
    managerArray = ['null'];
    query = "select * from manager";
    connection.query(query,function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            managerArray.push(res[i].manager);
            managerIdArray.push(res[i].id);
        }
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
            choices: employeeArray
        }
    );
}
async function removeManagerQuery() {
    managerArray.shift();
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which manager would you like to remove?",
            choices: managerArray
        }
    );
}
async function addEmployeeQuery() {
    return inquirer.prompt(
        [{
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
            name: "role",
            message: "What is the role of the employee?",
            choices: roleArray
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the manager of the employee?",
            choices: managerArray
        }]
    );
}
async function getByDepartmentQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which department would you like to view?",
            choices: departmentArray
        }
    );
}
async function getByManagerQuery() {
    managerArray.shift();
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which manager's employees would you like to view?",
            choices: managerArray
        }
    );
}
async function updateManagerQuery() {
    return inquirer.prompt(
        [{
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employeeArray
        },
        {
            type: "list",
            name: "manager",
            message: "Which manager would you like to assign?",
            choices: managerArray
        }]
    );
}
async function updateRoleQuery() {
    return inquirer.prompt(
        [{
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employeeArray
        },
        {
            type: "list",
            name: "role",
            message: "Which role would you like to assign?",
            choices: roleArray
        }]
    );
}
async function removeEmployeeQuery() {
    return inquirer.prompt(
        {
            type: "list",
            name: "name",
            message: "Which employee would you like to remove?",
            choices: employeeArray
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
async function backToMain() {
    const backToMainPrompt = function(){
        return inquirer.prompt(
            {
                type: "list",
                name: "response",
                message: "Would you like to return to the main menu?",
                choices: ["Yes", "No"]
            }
        );
    }
    let backToMainResponse = await backToMainPrompt();
    if(backToMainResponse.response === "Yes"){
        init();
    }
    else{
        console.log("All changes have been saved.  Goodbye!");
    }
}
async function init() {
    renderEmployees();
    renderRoles();
    renderDepartments();
    renderManagers();
    let first = await mainPrompt();
    if (first.choice === menu[0]){
        getEmployees();
    }
    else if (first.choice === menu[1]){
        answer = await getByDepartmentQuery();
        getEmployeesByDepartment(answer);
        
    }
    else if (first.choice === menu[2]){
        answer = await getByManagerQuery();
        getEmployeesByManager(answer);
    }
    else if (first.choice === menu[3]){
        answer = await addEmployeeQuery();
        addEmployee(answer);
    }
    else if (first.choice === menu[4]){
        answer = await removeEmployeeQuery();
        removeEmployee(answer);
    }
    else if (first.choice === menu[5]){
        answer = await updateRoleQuery();
        updateEmployeeRole(answer);
    }
    else if (first.choice === menu[6]){
        answer = await updateManagerQuery();
        updateEmployeeManager(answer);
    }
    else if (first.choice === menu[7]){
        answer = await addManagerQuery();
        addManager(answer);
    }
    else if (first.choice === menu[8]){
        answer = await removeManagerQuery();
        removeManager(answer);
    }
    else if (first.choice === menu[9]){
        
    }
    else if (first.choice === menu[10]){
        
    }
    else if (first.choice === menu[11]){
        
    }
    else if (first.choice === menu[12]){
        
    }
    else if (first.choice === menu[13]){
        
    }
    setTimeout(function(){ backToMain(); }, 500);;
}
init();