CREATE DATABASE IF NOT EXISTS library_borrowed_books_service;

USE library_borrowed_books_service;

DROP TABLE IF EXISTS borrowedbooks;

CREATE TABLE IF NOT EXISTS borrowedbooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    book_id INT,
    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL
);
