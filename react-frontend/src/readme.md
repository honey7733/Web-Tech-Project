# Backend API Documentation

This document describes the API endpoints provided by the Go backend server for the Book Blockchain project.

---

## Endpoints

### GET `/`

- **Description:**  
  Retrieves the entire blockchain as a JSON array. Each item in the array represents a block containing blockchain metadata along with book data.

- **Response:**

  - **Status Code:** 200 OK  
    **Body:** JSON array of blocks. Each block contains:
    - `Pos` (number): The block's position in the blockchain.
    - `Timestamp` (string): The creation time of the block.
    - `Hash` (string): The SHA256 hash of the block.
    - `PrevHash` (string): The hash of the previous block.
    - `Data` (object): The book information comprising:
      - `id` (string): Auto-generated unique identifier.
      - `title` (string): Title of the book.
      - `author` (string): Author name.
      - `publish_date` (string): Publish date in `YYYY-MM-DD` format.
      - `isbn` (string): ISBN of the book.

- **Error Responses:**

  - **Status Code:** 500 Internal Server Error  
    **Body:** Error message if the blockchain data cannot be marshaled or an unexpected error occurs.

---

### POST `/`

- **Description:**  
  Adds a new block to the blockchain by submitting book data.

- **Request:**

  - **Headers:**  
    `Content-Type: application/json`
  
  - **Body:** JSON payload containing the following fields:
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "isbn": "Unique ISBN",
    "publish_date": "YYYY-MM-DD"
  }
  ```
  *All fields are required.*  
  The backend will generate a unique `id` for the book using an MD5 hash based on the ISBN and publish date.

- **Response:**

  - **Status Code:** 200 OK  
    **Body:** Returns the added book record in JSON format.
    ```json
    {
      "id": "generated-unique-id",
      "title": "Book Title",
      "author": "Author Name",
      "publish_date": "YYYY-MM-DD",
      "isbn": "Unique ISBN"
    }
    ```

- **Error Responses:**

  - **Status Code:** 400 Bad Request  
    **Body:** `"Invalid request payload"`  
    Returned if JSON decoding of the request body fails.

  - **Status Code:** 500 Internal Server Error  
    **Body:**  
    - `"Blockchain is not initialized"` if the blockchain is not set up, or  
    - `"Could not write block"` if an unexpected error occurs during response marshalling.

---

## How to Run

1. Make sure you have [Go installed](https://golang.org/).
2. Open a terminal in the project root directory:
   ```
   cd c:\Users\Dell\Desktop\Web-Tech-Project
   ```
3. Run the backend server:
   ```
   go run main.go
   ```
   The server will start and listen on port `3009`.

---

## CORS

The backend has CORS enabled allowing any origin. The following headers are set on each response:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

---

## Logging

- Actions like fetching blockchain data, adding blocks, and errors are logged to the console.

---

This documentation can be updated as the API evolves. For any questions or issues with the API, please refer to the project repository or contact the maintainers.