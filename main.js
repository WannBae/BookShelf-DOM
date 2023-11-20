const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser does not support storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const jsonString = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, jsonString);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// mencari buku berdasarkan id
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// mencari book id berdasarkan index
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// fungsi membuat book
function makeBookList(bookObject) {
  const { id, title, author, year, IsComplete } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);

  if (IsComplete) {
    // Tombol selesai
    const unCompleteButton = document.createElement("button");
    unCompleteButton.classList.add("green");
    unCompleteButton.innerText = "Belum selesai di Baca";
    unCompleteButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    // Tombol hapus
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    actionContainer.append(unCompleteButton, deleteButton);

    container.append(actionContainer);
  } else {
    // tombol selesai
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerText = "Selesai dibaca";
    completeButton.addEventListener("click", function () {
      addBookCompleted(bookObject.id);
    });
    // tombol hapus
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    actionContainer.append(completeButton, deleteButton);

    container.append(actionContainer);
  }

  return container;
}

// function makeBookList(bookObject) {
//   const { id, title, author, year, IsComplete } = bookObject;

//   const textTitle = document.createElement("h3");
//   textTitle.innerText = bookObject.title;

//   const textAuthor = document.createElement("p");
//   textAuthor.innerText = bookObject.author;

//   const textYear = document.createElement("p");
//   textYear.innerText = bookObject.year;

//   const textContainer = document.createElement("div");
//   textContainer.classList.add("action");
//   textContainer.append(textTitle, textAuthor, textYear);

//   const container = document.createElement("div");
//   container.classList.add("book_item");
//   container.append(textContainer);

//   const actionContainer = document.createElement("div"); // Tambahkan container baru untuk tombol
//   actionContainer.classList.add("action");

//   if (IsComplete) {
//     // Tombol selesai
//     const unCompleteButton = document.createElement("button");
//     unCompleteButton.classList.add("green");
//     unCompleteButton.innerText = "Belum selesai di Baca";
//     unCompleteButton.addEventListener("click", function () {
//       undoBookFromCompleted(bookObject.id);
//     });

//     // Tombol hapus
//     const deleteButton = document.createElement("button");
//     deleteButton.classList.add("red");
//     deleteButton.innerText = "Hapus buku";
//     deleteButton.addEventListener("click", function () {
//       removeBook(bookObject.id);
//     });

//     actionContainer.append(unCompleteButton, deleteButton);
//   } else {
//     // tombol selesai
//     const completeButton = document.createElement("button");
//     completeButton.classList.add("green");
//     completeButton.innerText = "Selesai Dibaca";
//     completeButton.addEventListener("click", function () {
//       addBookCompleted(bookObject.id);
//     });
//     // tombol hapus
//     const deleteButton = document.createElement("button");
//     deleteButton.classList.add("red");
//     deleteButton.innerText = "Hapus buku";
//     deleteButton.addEventListener("click", function () {
//       removeBook(bookObject.id);
//     });

//     actionContainer.append(completeButton, deleteButton);
//   }

//   container.append(actionContainer); // Tambahkan container tombol ke dalam container utama

//   return container;
// }

// fungsi menambahkan buku

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const year = parseInt(textYear, 10);

  const bookObject = generateBookObject(
    generatedID,
    textTitle,
    textAuthor,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi tombol selesai
function addBookCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;
  bookTarget.IsComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi menghapus buku
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// fungsi undo
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;
  bookTarget.IsComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// menampilkan data dari localstorage ketika halaman dimuat
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// loaded All Document Object

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompleted = document.getElementById("incompleteBookshelfList");
  const completedBook = document.getElementById("completeBookshelfList");
  uncompleted.innerHTML = "";
  completedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookList(bookItem);
    if (bookItem.isComplete) {
      completedBook.append(bookElement);
    } else {
      uncompleted.append(bookElement);
    }
  }
});
