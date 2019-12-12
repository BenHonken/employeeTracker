CREATE DATABASE employees;
USE employees;

CREATE TABLE department
(
  id int AUTO_INCREMENT,
  department varchar (30) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role
(
  id int AUTO_INCREMENT,
  title varchar (30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id int NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE employee
(
  id int AUTO_INCREMENT,
  first_name varchar (30) NOT NULL,
  last_name varchar (30) NOT NULL,
  role_id int NOT NULL,
  manager_id int,
  PRIMARY KEY (id)
);
CREATE TABLE manager
(
  id int AUTO_INCREMENT,
  employee_id int NOT NULL,
  name int NOT NULL
  PRIMARY KEY (id)
);

INSERT INTO department (department) VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');
INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead', 100000, 1),
('Sales Person', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Legal Team Lead', 225000, 4),
('Lawyer', 195000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Malcolm', 'Reynolds', 1, NULL),
('Zoe', 'Washburne', 2, 1),
('Kaylee', 'Frye', 3, 1),
('Hoban', 'Washburne', 4, 2),
('Jayne', 'Cobb', 5, 1),
('Derrial', 'Book', 6, 1),
('River', 'Tam', 7, 3);
INSERT INTO manager (employee_id, name) VALUES
(1, 'Malcolm Reynolds'),
(3, 'Kaylee Frye'),
(6, 'Derrial Book');