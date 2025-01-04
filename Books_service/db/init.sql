CREATE DATABASE IF NOT EXISTS library_books_service;

USE library_books_service;

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    copies INT DEFAULT 1
);
