////////////////////////////////////////////////////////////////////////////////////
// Zmienne globalne //
////////////////////////////////////////////////////////////////////////////////////

// const na api URL
const apiURL = "http://localhost:55828/api/";

////////////////////////////////////////////////////////////////////////////////////
// DOM LOADED //
////////////////////////////////////////////////////////////////////////////////////

$(function () {
    
    // pobiera wszystkie książki
    getAllBooks();

    // Eventy - Edit, Delete, Lend
    $('#booksTable').on("click", "button.editBook", function (e) {
        console.log("EDIT ", this);
    });

    $('#booksTable').on("click", "button.deleteBook", function (e) {
        console.log("DELETE ", this);
    });

    $('#booksTable').on("click", "button.lendBook", function (e) {
        console.log("LEND ", this);
    });

});

////////////////////////////////////////////////////////////////////////////////////
// AJAX //
////////////////////////////////////////////////////////////////////////////////////

// AJAX - pobiera wszystkie książki

function getAllBooks() {
    $.ajax({
        url: apiURL + "books/"
    }).done(function (resp) {
        renderAllBooks(resp);
    }).fail(function (err) {
        console.log("błąd: ", err)
    })
};

// AJAX - pobiera pojedyńczą książkę

function getBook(bookID) {
    $.ajax({
        url: apiURL + "books/" + bookID
    }).done(function (resp) {
        renderBook(resp);
    }).fail(function (err) {
        console.log(err);
    });
};

// AJAX - dodaje książkę

function addNewBook(newbook) {
    $.ajax({
        url: apiURL + "books",
        type: "POST",
        dataType: "json",
        data: newbook // NEWBOOK - JSON
    }).done(function (resp) {
        console.log(resp);
    }).fail(function (err) {
        console.log(err);
    })
};

// AJAX - edytuje książkę

function editBook(bookID, newBook) {
    $.ajax({
        url: apiURL + "books/" + bookID,
        type: "PUT",
        dataType: "json",
        data: newBook // NEWBOOK - JSON
    }).done(function (resp) {
        console.log(resp);
    }).fail(function (err) {
        console.log(err);
    });
};

////////////////////////////////////////////////////////////////////////////////////
// AJAX //
////////////////////////////////////////////////////////////////////////////////////

// Funkcja - pod AJAX - renderuje książki

function renderAllBooks(books) {
    var booksTable = $("#booksTable").find("tbody");
    for (var i = 0; i < books.length; i++) {
        var newRow = $("<tr data-book-id=" + books[i].ID + "></tr>");
        var titleCol = $("<td>").text(books[i].Title);
        titleCol.appendTo(newRow);
        var authorCol = $("<td>").text(books[i].Author);
        authorCol.appendTo(newRow);

        var buttons = $(`
        <tr>
            <td>[Tytuł]</td>
            <td>[Autor]</td>
            <td>
                <div class="button-group">
                    <button class="btn btn-primary btn-sm editBook">Edytuj</button>
                    <button class="btn btn-danger btn-sm deleteBook">Usuń</button>
                    <button class="btn btn-info btn-sm lendBook">Wypożycz</button>
                </div>
            </td>
        </tr>)`)
        buttons.appendTo(newRow);
        newRow.appendTo(booksTable);
    }
};