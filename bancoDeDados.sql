# BANCO DE DADOS ATUALIZADO

create database FarAway;
use FarAway;

create table users(
id int not null auto_increment primary key,
name varchar(255) not null,
email varchar(255) not null unique, 
password varchar(255) not null,
cpf_number bigint,
status enum('user', 'admin') default('user'),
created_at timestamp default current_timestamp,
perfil enum('user', 'admin') default("user")
);

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


=