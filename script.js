const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');

function fetchBooks() {
  fetch("http://localhost:3009/")
    .then(res => res.json())
    .then(data => {
      bookList.innerHTML = '';
      data.forEach(book => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${book.title}</strong> by ${book.author}<br>ISBN: ${book.isbn}<br>Published: ${book.publish_date}`;
        bookList.appendChild(item);
      });
    })
    .catch(err => {
      console.error('Error loading books:', err);
    });
}

bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newBook = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    isbn: document.getElementById('isbn').value,
    publish_date: document.getElementById('publish_date').value
  };

  const res = await fetch("http://localhost:3009/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBook)
  });

  if (res.ok) {
    alert("Book added!");
    bookForm.reset();
    fetchBooks();
  } else {
    alert("Failed to add book.");
  }
});

window.onload = fetchBooks;

// Backend API Documentation

This document describes the API endpoints for the Book Blockchain backend.

## Base URL
`http://localhost:3009`

---

## Endpoints

### 1. Retrieve Blockchain
- **URL:** `/`
- **Method:** `GET`
- **Description:** Retrieves the entire blockchain as an array of blocks.
- **Response:**
  - **200 OK:** Returns the blockchain data in JSON format.
  - **500 Internal Server Error:** Returns an error message if an error occurs.

---

### 2. Write Block (Book Checkout)
- **URL:** `/`
- **Method:** `POST`
- **Description:** Adds a new block to the blockchain using a book checkout record.
- **Request Body:** (JSON)
  ```json
  {
    "book_id": "string",       // Unique identifier for the book
    "user": "string",          // The user checking out the book
    "checkout_date": "string", // Date of checkout (e.g., "2023-10-01")
    "is_genesis": false        // Boolean flag; normally false (true only for the genesis block)
  }
