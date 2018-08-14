////////////////////////////////////////////////////////////////////////////////////
// Zmienne globalne //
////////////////////////////////////////////////////////////////////////////////////

// const na api URL
const apiURL = "http://localhost:49364/api/";

////////////////////////////////////////////////////////////////////////////////////
// DOM LOADED //
////////////////////////////////////////////////////////////////////////////////////

$(function () {
    
    // pobiera wszystkie książki
    ajaxGetAllBooks();

    // Eventy - Edit, Delete, Lend
    $('#booksTable').on("click", "button.editBook", function (e) {
        let bookID = $(this).parent().parent().parent().parent().attr("data-book-id");
        ajaxRemoveBook(bookID);
        ajaxGetAllBooks();
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

function ajaxGetAllBooks() {
    $.ajax({
        url: apiURL + "books/"
    }).done(function (resp) {
        functionRenderAllBooks(resp);
    }).fail(function (err) {
        console.log("błąd: ", err)
    })
};

// AJAX - pobiera pojedyńczą książkę

function ajaxGetBook(bookID) {
    $.ajax({
        url: apiURL + "books/" + bookID
    }).done(function (resp) {
        renderBook(resp);
    }).fail(function (err) {
        console.log(err);
    });
};

// AJAX - dodaje książkę

function ajaxAddNewBook(newbook) {
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

function ajaxEditBook(bookID, newBook) {
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

// AJAX - usuń książkę

function ajaxRemoveBook(bookID) {
    $.ajax({
        url: apiURL + "books/" + bookID,
        type: "DELETE",
    }).done(function (resp) {
        console.log(resp);
    }).fail(function (err) {
        console.log(err);
    });
};

////////////////////////////////////////////////////////////////////////////////////
// funkcje pod AJAX //
////////////////////////////////////////////////////////////////////////////////////

// Funkcja - pod AJAX - renderuje książki

function functionRenderAllBooks(books) {
    var booksTable = $("#booksTable").find("tbody");
    for (var i = 0; i < books.length; i++) {
        var newRow = $("<tr data-book-id=" + books[i].ID + "></tr>");
        var titleCol = $("<td>").text(books[i].Title);
        titleCol.appendTo(newRow);
        var authorCol = $("<td>").text(books[i].Author);
        authorCol.appendTo(newRow);

        var buttons = $(`
        <tr>
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