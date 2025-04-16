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
    "book_id": "string", // Unique identifier for the book
    "user": "string", // The user checking out the book
    "checkout_date": "string", // Date of checkout (e.g., "2023-10-01")
    "is_genesis": false // Boolean flag; normally false (true only for the genesis block)
  }
  ```
