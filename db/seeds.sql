INSERT INTO department (name)
VALUES
    ('Drivers'),
    ('Engineering'),
    ('Marketing'),
    ('Logistics');
    

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Driver', 10000000.00, 1),
    ('Test Driver', 2000000.00, 1),
    ('Team Principal', 1000000.00, 2),
    ('Performance Engineer', 150000.00, 2),
    ('Trackside Engineer', 120000.00, 2),
    ('Car Mechanic', 80000.00, 2),
    ('Sponsor Relations', 90000.00, 3),
    ('PR/Social Media', 65000.00, 3),
    ('Truck Driver', 70000.00, 4),
    ('Freight Handler', 65000.00, 4),
    ('Team Travel Agent', 65000.00, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Toto', 'Wolff', 3, NULL),
    ('Sebastian', 'Vettel', 1, 1),
    ('Kimi', 'Raikkonen', 1, 1),
    ('Adrian', 'Newey', 4, 1),
    ('Pete', 'Bonnington', 4, 4),
    ('Guillaume', 'Rocquelin', 4, 4),
    ('Bill', 'Quill', 6, 4),
    ('Marie', 'Coolidge', 6, 4),
    ('Johana', 'Tortelli', 7, 1),
    ('Kyle', 'Lawrence', 8, 9),
    ('Luke', 'Rezland', 9, 1),
    ('Kevin', 'Peters', 10, 10);