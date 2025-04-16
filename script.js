const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");

function fetchBooks() {
  fetch("http://localhost:3009/")
    .then((res) => res.json())
    .then((data) => {
      bookList.innerHTML = "";
      data.forEach((block) => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>Block #${block.Pos}</strong><br>
          <strong>Title:</strong> ${block.Data?.title || "N/A"}<br>
          <strong>Author:</strong> ${block.Data?.author || "N/A"}<br>
          <strong>ISBN:</strong> ${block.Data?.isbn || "N/A"}<br>
          <strong>Published:</strong> ${block.Data?.publish_date || "N/A"}<br>
          <strong>Hash:</strong> ${block.Hash}<br>
          <strong>Previous Hash:</strong> ${block.PrevHash || "N/A"}
        `;
        bookList.appendChild(item);
      });
    })
    .catch((err) => {
      console.error("Error loading books:", err);
    });
}

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const isbn = document.getElementById("isbn").value.trim();
  const publish_date = document.getElementById("publish_date").value;

  if (!title || !author || !isbn || !publish_date) {
    alert("All fields are required!");
    return;
  }

  const newBook = { title, author, isbn, publish_date };

  const res = await fetch("http://localhost:3009/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBook),
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
