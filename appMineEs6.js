// ES6 version

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {

    addBookToList(book) {
        // Getting list element
        const list = document.getElementById('book-list');

        // Creating tr element
        const row = document.createElement('tr');
        // console.log(row);

        // Insert columns to tr
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="delete">X</a></td>
        `
        // Adding it to list
        list.appendChild(row);
    }

    showAlert(msg, className) {
        // Create a div
        const errorDiv = document.createElement('div');
        // Add class to div
        errorDiv.className = `alert ${className}`;
        // Add text to div
        errorDiv.appendChild(document.createTextNode(msg));
        // Insert it into dom - Get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(errorDiv, form);

        // Timeout after 3 secs
        setTimeout(function () {
            document.querySelector('.alert').remove();
            // container.remove(errorDiv); Not working
        }, 3000);
    }

    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

}

// Local storage class
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI();
            // Add book to UI
            ui.addBookToList(book);
        })
    }

    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBooks(isbn){
        const books = Store.getBooks();
        books.forEach(function(book,index){
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        })
        localStorage.setItem('books',JSON.stringify(books));
    }

}

// DOM Load event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

// Event Listeners
document.querySelector('#book-form').addEventListener('submit',function(e){
    // console.log('test');
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    // console.log(title,author,isbn);

    // Instantiating a book
    const book = new Book(title,author,isbn);
    // console.log(book);

    // Instantiate UI
    const ui = new UI();
    // console.log(ui);

    // Validate Input
    if(title === '' || author === '' || isbn === ''){
        // alert('Failed');
        // Error UI
        ui.showAlert('Please fill in all fields','error');
    }else{
        // Add UI to book
        ui.addBookToList(book);
        // Add book to LS
        Store.addBooks(book);

        // Show success
        ui.showAlert('Book Added!','success');

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
})

// Event listener for delete
document.getElementById('book-list').addEventListener('click',function(e){
    // Instantiate UI
    const ui = new UI();
    // Delete target
    ui.deleteBook(e.target);
    // Remove from LS
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
    // Setting alert
    ui.showAlert('Book Removed','success');
    e.preventDefault();
})