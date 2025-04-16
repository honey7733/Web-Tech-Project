import React, { useState, useEffect } from "react";

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publish_date: "",
  });

  useEffect(() => {
    fetch("http://localhost:3009/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching blockchain data:", err));
  }, []);

  const addBook = async () => {
    const response = await fetch("http://localhost:3009/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });
    if (response.ok) {
      alert("Book added successfully!");
      setNewBook({ title: "", author: "", isbn: "", publish_date: "" });
    } else {
      alert("Failed to add book");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Blockchain</h1>
      <div className="mb-4">
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          type="date"
          value={newBook.publish_date}
          onChange={(e) =>
            setNewBook({ ...newBook, publish_date: e.target.value })
          }
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addBook}>
          Add Book
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-2">Blockchain Data</h2>
      <ul>
        {books.map((block, index) => (
          <li key={index} className="border p-2 mb-2">
            <p>
              <strong>Title:</strong> {block.Data?.title || "N/A"}
            </p>
            <p>
              <strong>Author:</strong> {block.Data?.author || "N/A"}
            </p>
            <p>
              <strong>Hash:</strong> {block.Hash}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
