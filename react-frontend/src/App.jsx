import React, { useState, useEffect } from "react";

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publish_date: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch blockchain data on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3009/");
      if (!res.ok) throw new Error("Failed to fetch blockchain data");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching blockchain data:", err);
      alert("Error fetching blockchain data. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new book to the blockchain
  const addBook = async () => {
    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.isbn ||
      !newBook.publish_date
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3009/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        alert("Book added successfully!");
        setNewBook({ title: "", author: "", isbn: "", publish_date: "" });
        fetchBooks();
      } else {
        const errorText = await response.text();
        alert(`Failed to add book: ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. Please check the console for details.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📚 Book Blockchain
      </h1>

      {/* Form to add a new book */}
      <div className="mb-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Add a New Book
        </h2>
        <input
          className="border p-2 w-full mb-2 rounded"
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          type="text"
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          type="date"
          value={newBook.publish_date}
          onChange={(e) =>
            setNewBook({ ...newBook, publish_date: e.target.value })
          }
        />
        <button
          className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addBook}
        >
          Add Book
        </button>
      </div>

      {/* Display blockchain data as a timeline */}
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
        Blockchain Data
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">No blocks available.</p>
      ) : (
        <div className="timeline relative">
          {books.map((block, index) => (
            <div key={index} className="timeline-item flex relative pb-8">
              <div className="timeline-dot absolute -left-2 top-2 h-4 w-4 rounded-full bg-blue-500"></div>
              <div className="ml-6 block bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Block #{block.Pos}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Timestamp:</strong> {block.Timestamp}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Previous Hash:</strong>{" "}
                  <span className="text-xs break-all text-gray-500 dark:text-gray-400">
                    {block.PrevHash || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Hash:</strong>{" "}
                  <span className="text-xs break-all text-gray-500 dark:text-gray-400">
                    {block.Hash}
                  </span>
                </p>
                {block.Data && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4">
                      Book Details:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Title:</strong> {block.Data.title || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Author:</strong> {block.Data.author || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>ISBN:</strong> {block.Data.isbn || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Publish Date:</strong>{" "}
                      {block.Data.publish_date || "N/A"}
                    </p>
                  </>
                )}
              </div>
              {index !== books.length - 1 && (
                <div className="timeline-divider absolute left-0 top-8 h-full border-l-2 border-blue-500"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
