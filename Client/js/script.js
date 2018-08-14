////////////////////////////////////////////////////////////////////////////////////
// Zmienne globalne //
////////////////////////////////////////////////////////////////////////////////////

// const na api URL
const apiURL = "http://localhost:53269/api/";

////////////////////////////////////////////////////////////////////////////////////
// Funkcje globalne //
////////////////////////////////////////////////////////////////////////////////////

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

////////////////////////////////////////////////////////////////////////////////////
// DOM LOADED //
////////////////////////////////////////////////////////////////////////////////////

$(function () {

    ///////////////////////////////////////////////////////////////////////////////
    // KSIĄŻKI
    ///////////////////////////////////////////////////////////////////////////////
    // pobiera wszystkie książki
    ajaxGetAllBooks();

    // pobranie przycisku dodania książki
    let addButton = $("#form-add-button");

    // Dodawanie lub edycja
    addButton.on("click", function (event) {
        event.preventDefault();

        // Walidatione!
        let bookTitle = $("#form-title").val();
        if (isEmptyOrSpaces(bookTitle)) {
            functionShowStatement("Pusty Tytuł", "danger");
            return null;
        }

        // Walidatione!
        let bookAuthor = $("#form-author").val();
        if (isEmptyOrSpaces(bookAuthor)) {
            functionShowStatement("Pusty Autor", "danger");
            return null;
        }

        // JSON z nową książką
        var newBook = {
            Title: bookTitle,
            Author: bookAuthor
        }

        if ($(this).text() == "Dodaj") {
            ajaxAddNewBook(newBook);
        }
        else if ($(this).text() == "Edytuj") {
            let bookID = $("#nigdy-mnie-nie-znajdziecie").eq(0).val();
            ajaxEditBook(bookID, newBook);
            addButton.html('<i class="fa fa-plus mr-2"></i>Dodaj');
        }
        else {
            functionShowStatement("Błędna akcja!!!!", "danger");
            return null;
        }
    });

    // Eventy - Edit, Delete, Lend
    $('#booksTable').on("click", "button.editBook", function () {
        let addButton = $("#form-add-button");
        addButton.html('<i class="fa fa-plus mr-2"></i>Edytuj');

        let bookID = $(this).closest("tr[data-book-id]").attr("data-book-id");
        let neverFound = $("#nigdy-mnie-nie-znajdziecie");
        neverFound.val(bookID);

        // Uzupełnienie pól tytułu i Autora
        ajaxGetBook(bookID);
    });

    $('#booksTable').on("click", "button.deleteBook", function () {
        let bookID = $(this).closest("tr[data-book-id]").attr("data-book-id");
        ajaxRemoveBook(bookID);
    });

    $('#booksTable').on("click", "button.lendBook", function () {
        $(".chooseReader").css("display", "inline");
        let bookID = $(this).closest("tr[data-book-id]").attr("data-book-id");
        let neverFound = $("#nigdy-mnie-nie-znajdziecie");
        neverFound.val(bookID);
    });

    ///////////////////////////////////////////////////////////////////////////////
    // UŻYTKOWNICY
    //////////////////////////////////////////////////////////////////////////////
    // pobiera wszystkich czytelników
    ajaxGetAllReaders();

    // pobranie przycisku dodania czytelnika
    let readerAddButton = $("#reader-form-add-button");

    // Dodawanie lub edycja
    readerAddButton.on("click", function (event) {
        event.preventDefault();

        // Walidatione!
        let readerName = $("#reader-form-name").val();
        if (isEmptyOrSpaces(readerName)) {
            functionShowStatement("Puste imię i nazwisko", "danger");
            return null;
        }

        // Walidatione!
        let readerAge = $("#reader-form-age").val();
        if (isEmptyOrSpaces(readerAge)) {
            functionShowStatement("Pusty wiek", "danger");
            return null;
        }

        // JSON z nowym czytelnikiem
        var newReader = {
            Name: readerName,
            Age: readerAge
        }

        if ($(this).text() == "Dodaj") {
            ajaxAddNewReader(newReader);
        }
        else if ($(this).text() == "Edytuj") {
            let readerID = $("#reader-nigdy-mnie-nie-znajdziecie").eq(0).val();
            ajaxEditReader(readerID, newReader);
            readerAddButton.html('<i class="fa fa-plus mr-2"></i>Dodaj');
        }
        else {
            functionShowStatement("Błędna akcja!!!!", "danger");
            return null;
        }
    });

    // Eventy - Edit, Delete, Choice
    $('#readersTable').on("click", "button.editReader", function () {
        let readerAddButton = $("#reader-form-add-button");
        readerAddButton.html('<i class="fa fa-plus mr-2"></i>Edytuj');

        let readerID = $(this).closest("tr[data-reader-id]").attr("data-reader-id");
        let readerNeverFound = $("#reader-nigdy-mnie-nie-znajdziecie");
        readerNeverFound.val(readerID);

        // Uzupełnienie pól Imienia oraz Nazwiska i Wieku
        ajaxGetReader(readerID);
    });

    $('#readersTable').on("click", "button.deleteReader", function () {
        let readerID = $(this).closest("tr[data-reader-id]").attr("data-reader-id");
        ajaxRemoveReader(readerID);
    });

    $('#readersTable').on("click", "button.chooseReader", function () {
        $(".chooseReader").css("display", "none");
        ajaxLendBookByReader();
    });
});

///////////////////////////////////////////////////////////////////////////////////
// AJAX - KSIĄŻKI //
///////////////////////////////////////////////////////////////////////////////////
// AJAX - pobiera wszystkie książki

function ajaxGetAllBooks() {
    $.ajax({
        url: apiURL + "books/"
    }).done(function (resp) {
        functionRenderAllBooks(resp);
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    })
};

// AJAX - pobiera pojedyńczą książkę

function ajaxGetBook(bookID) {
    $.ajax({
        url: apiURL + "books/" + bookID
    }).done(function (resp) {
        functionRenderBook(resp);
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    });
};

// AJAX - dodaje książkę

function ajaxAddNewBook(newBook) {
    $.ajax({
        url: apiURL + "books",
        type: "POST",
        dataType: "json",
        data: newBook // NEWBOOK - JSON
    }).done(function () {
        functionShowStatement("Added!", "success");
        ajaxGetAllBooks();
        functionResetTitleAndAuthorInputs();
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    })
};

// AJAX - edytuje książkę

function ajaxEditBook(bookID, newBook) {
    $.ajax({
        url: apiURL + "books/" + bookID,
        type: "PUT",
        data: newBook // NEWBOOK - JSON
    }).done(function () {
        functionShowStatement("Edited!", "success");
        ajaxGetAllBooks();
        functionResetTitleAndAuthorInputs();
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    });
};

// AJAX - usuń książkę

function ajaxRemoveBook(bookID) {
    $.ajax({
        url: apiURL + "books/" + bookID,
        type: "DELETE",
    }).done(function () {
        functionShowStatement("Deleted!", "warning");
        ajaxGetAllBooks();
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    });
};


////////////////////////////////////////////////////////////////////////////////////
// AJAX - UŻYTKOWNICY //
////////////////////////////////////////////////////////////////////////////////////
// AJAX - pobiera wszystkich czytelników

function ajaxGetAllReaders() {
    $.ajax({
        url: apiURL + "readers/"
    }).done(function (resp) {
        functionRenderAllReaders(resp);
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    })
};

// AJAX - pobiera czytelnika

function ajaxGetReader(readerID) {
    $.ajax({
        url: apiURL + "readers/" + readerID
    }).done(function (resp) {
        functionRenderReader(resp);
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    });
};

// AJAX - dodaje czytelnika

function ajaxAddNewReader(newReader) {
    $.ajax({
        url: apiURL + "readers",
        type: "POST",
        dataType: "json",
        data: newReader // NEWREADER - JSON
    }).done(function () {
        functionShowStatement("Added!", "success");
        ajaxGetAllReaders();
        functionResetNameAndAgeInputs();
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    })
};

// AJAX - edytuje czytelnika

function ajaxEditReader(ID, newReader) {
    $.ajax({
        url: apiURL + "readers/" + ID,
        type: "PUT",
        data: newReader // NEWREADER - JSON
    }).done(function () {
        functionShowStatement("Edited!", "success");
        ajaxGetAllReaders();
        functionResetNameAndAgeInputs();
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    });
};

// AJAX - usuń czytelnika

function ajaxRemoveReader(readerID) {
    $.ajax({
        url: apiURL + "readers/" + readerID,
        type: "DELETE",
    }).done(function () {
        functionShowStatement("Deleted!", "warning");
        ajaxGetAllReaders();
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    });
};

////////////////////////////////////////////////////////////////////////////////////
// AJAX - WYPOŻYCZENIE //
////////////////////////////////////////////////////////////////////////////////////

// AJAX - wypożycz książkę dla czytelnika

function ajaxLendBookByReader(newLend) {
    $.ajax({
        url: apiURL + "lend",
        type: "POST",
        dataType: "json",
        data: newLend // DATA - JSON
    }).done(function () {
        functionShowStatement("Lent!", "success");
        functionNewLendNode(newLend);
        functionResetNameAndAgeInputs();
    }).fail(function (err) {
        functionShowStatement(`Error: ${err.status} - ${err.statusText}`, "danger");
    })
};

////////////////////////////////////////////////////////////////////////////////////
// funkcje pod AJAX //
////////////////////////////////////////////////////////////////////////////////////

// Funkcja - pod AJAX - renderuje książki

function functionRenderAllBooks(books) {
    var booksTable = $("#booksTable").find("tbody");

    // Usuwanie wnętrza tabeli
    booksTable.html("");

    // Wypełnianie aktualnymi danymi
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
        </tr>)`);

        newRow.append(buttons);
        booksTable.append(newRow);
    }
};

// Funkcja - pod AJAX - renderuje książkę

function functionRenderBook(book) {
    let bookTitle = $("#form-title");
    let bookAuthor = $("#form-author");

    bookTitle.val(book.Title);
    bookAuthor.val(book.Author);
}

// Funkcja - pod komunikaty - pokazuje komunikat

function functionShowStatement(text, statementType) {
    let divForAlert = $("#place-for-alert");
    let alertClass = "alert-";

    switch (statementType) {
        case "success":
            alertClass += "success";
            break;

        case "warning":
            alertClass += "warning";
            break;

        case "danger":
            alertClass += "danger";
            break;

        case "info":
            alertClass += "info";
            break;

        default:
            alertClass += "primary";
            break;
    }

    var newAlert =
        `<div class="col">
        <div class="alert alert-dismissible ${alertClass}" style="display: block;" role="alert">
            ${text}
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        </div>
    </div>`;

    divForAlert.html(newAlert);
}

// Funkcja - resetująca inputy -> Tytuł i Autor

function functionResetTitleAndAuthorInputs() {
    $("#form-title").val("");
    $("#form-author").val("");
}

// Funkcja - resetująca inputy -> Imię i nazwisko oraz Wiek

function functionResetNameAndAgeInputs() {
    $("#reader-form-name").val("");
    $("#reader-form-age").val("");
}

// Funkcja - pod AJAX - renderuje czytelników

function functionRenderAllReaders(readers) {
    var readersTable = $("#readersTable").find("tbody");

    // Usuwanie wnętrza tabeli
    readersTable.html("");

    // Wypełnianie aktualnymi danymi
    for (var i = 0; i < readers.length; i++) {
        var newRow = $("<tr data-reader-id=" + readers[i].ID + "></tr>");
        var titleCol = $("<td>").text(readers[i].Name);
        titleCol.appendTo(newRow);
        var authorCol = $("<td>").text(readers[i].Age);
        authorCol.appendTo(newRow);

        var buttons = $(`
        <tr>
            <td>
                <div class="button-group">
                    <button class="btn btn-primary btn-sm editReader">Edytuj</button>
                    <button class="btn btn-danger btn-sm deleteReader">Usuń</button>
                    <button class="btn btn-info btn-sm chooseReader" style="display:none;">Wybierz</button>
                </div>
            </td>
        </tr>)`);

        newRow.append(buttons);
        readersTable.append(newRow);
    }
};
// Funkcja - pod AJAX - renderuje czytelnika

function functionRenderReader(reader) {
    let readerName = $("#reader-form-name");
    let readerAge = $("#reader-form-age");

    readerName.val(reader.Name);
    readerAge.val(reader.Age);
}

// Funkcja - pod ajax - tworzy nowy węzeł i dodaje go do istniejącej tabeli

function functionNewLendNode(newLend) {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // TODO ////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

