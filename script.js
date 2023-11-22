
document.addEventListener('DOMContentLoaded', function () {
    displayBooks();
});

function addBook() {
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var genre = document.getElementById('genre').value;

    if (title && author && genre) {
        var book = { title: title, author: author, genre: genre };
        saveBook(book);
        displayBooks();
        clearForm();
    } else {
        var missingFields = [];

        if (!title) {
            missingFields.push('Title');
        }

        if (!author) {
            missingFields.push('Author');
        }

        if (!genre) {
            missingFields.push('Genre');
        }

        var message = 'Please enter the missing fields: ' + missingFields.join(', ');
        alert(message);
    }
}

function saveBook(book) {
    var books = JSON.parse(localStorage.getItem('library')) || [];
    books.push(book);
    localStorage.setItem('library', JSON.stringify(books));
}

function displayBooks() {
    var bookTable = document.getElementById('book-table').getElementsByTagName('tbody')[0];
    bookTable.innerHTML = '';

    var books = JSON.parse(localStorage.getItem('library')) || [];
    books.forEach(function (book, count) {
        var row = bookTable.insertRow();
        var countCell = row.insertCell(0);
        var titleCell = row.insertCell(1);
        var authorCell = row.insertCell(2);
        var genreCell = row.insertCell(3);
        var actionCell = row.insertCell(4);

        countCell.textContent = count + 1; 
        titleCell.textContent = book.title;
        authorCell.textContent = book.author;
        genreCell.textContent = book.genre;

        var removeButton = document.createElement('button');
        removeButton.textContent = '-';
        removeButton.addEventListener('click', function () {
            removeBook(count);
            displayBooks();
        });

        actionCell.appendChild(removeButton);
    });
}

function removeBook(count) {
    var books = JSON.parse(localStorage.getItem('library')) || [];
    books.splice(count, 1);
    localStorage.setItem('library', JSON.stringify(books));
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('genre').value = '';
}

function downloadCSV() {
    var books = JSON.parse(localStorage.getItem('library')) || [];

    if (books.length === 0) {
        alert('No books yet :(');
        return;
    }

    var csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '#,Title,Author,Genre\n';

    books.forEach(function (book, count) {
        csvContent += `${count + 1},${book.title},${book.author},${book.genre}\n`;
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    var filename = addDateToFileName('library_catalog')
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
}

function addDateToFileName(filename) {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');
   
    var dateString = day + '-' + month + '-' + year;

   
    var newFilename = filename + '_' + dateString + '.csv';

    return newFilename;
}