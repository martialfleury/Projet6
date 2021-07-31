const form = document.getElementById('form-search')
const btn_add_book = document.getElementById('btn-add-book');
const list_book = document.getElementById('list-book');
const favori_book = document.getElementById('favori-book');
const search_title = document.getElementById('search-title')
const line = document.getElementById('hr')
let save = [];
let array_list = [];


btn_add_book.addEventListener('click', function(e) {
    form.innerHTML =
        "<div class='champ1'>" +
        "<label>Titre du livre</label>" +
        "<br/><input type='text' class='titredulivre' id='title-value' /></div>" +
        "<br/><div class='champ2' id='author-value'> <label>Auteur du livre</label> <br/>" +
        "<input type='text' class='auteurdulivre' /></div><br/>" +
        "<div class='champ3'><input type='button' value='Rechercher' onclick='clickMe()' class='rechercher'/></div><br/>" +
        "<div class='champ4'><input type='button' value='annuler'  onclick='cancel()' class='annuler'id='btn-cancel' /></div>"
        //btn_add_book.innerHTML = "<input type='button' value='Ajouter un livre' id='livre' class='livre' />"
    btn_add_book.innerHTML = "";
    favori_book.innerHTML = ""
});

function init() {
    getStorage()
}

function clickMe() {
    const title_book = document.getElementById('title-value').value;
    const author_value = document.getElementById('author-value').value;

    fetch('https://www.googleapis.com/books/v1/volumes?q=' + 'nana' + '+inauthor:' + 'zola', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            list_book.innerHTML = ""
            line.innerHTML = "<hr>"
            search_title.innerHTML = "Résultat de la recherche"
            if (value.items) {
                for (let index = 0; index < value.items.length; index++) {
                    let element = value.items[index];

                    let data = {
                        "id": element.id,
                        "title": element.volumeInfo.title,
                        "authors": element.volumeInfo.authors,
                        "description": element.volumeInfo.description ? element.volumeInfo.description.replace(/'/g, "\"").substring(0, 200) : "Aucune information disponible",
                        "image": element.volumeInfo.imageLinks ? element.volumeInfo.imageLinks.thumbnail : "unavailable.png"
                    }

                    list_book.innerHTML +=
                        "<div class='card' >" +
                        "<div class='container'><div class='container1'>" +
                        "<p><b>Titre:" + data.title + "</b></p>" +
                        "<p><b><i>Id:" + data.id + "</i></b></p>" +
                        "<p>Auteur:" + data.authors + "</p>" +
                        "<p class='description'>Description:" +
                        data.description +
                        "</p></div>" + "<div class='container2'>" +
                        "<i class='fas fa-bookmark' onClick='saveStorage(" + JSON.stringify(data) + ")'></i>" + "</div> </div>" +
                        "<div class='image'><img src=" + data.image + " height='20%' width='30%' alt='image du livre' /></div></div>"

                }
                getStorage()
            } else {
                list_book.innerHTML = "<p>Aucun livre n’a été trouvé</p>"
            }
        });
}

function cancel() {
    btn_add_book.innerHTML = "<input type='button' value='Ajouter un livre' id='livre' class='livre' />"
    form.innerHTML = ""
    list_book.innerHTML = ""
    window.location.reload()
    getStorage()
}

function getStorage() {

    var storedArray = JSON.parse(sessionStorage.getItem("books"));
    if (storedArray.length > 0) {
        array_list.push(storedArray)
    } else {
        sessionStorage.clear()
    }
    if (save.length > 0) {
        for (i = 0; i < save.length; i++) {
            favori_book.innerHTML +=
                "<div class='card'>" +
                "<div class='container'><div class='container1'>" +
                "<p><b>Titre:" + save[i].title + "</b></p>" +
                "<p><b><i>Id:" + save[i].id + "</i></b></p>" +
                "<p>Auteur:" + save[i].authors + "</p>" +
                "<p class='description'>Description:" +
                save[i].description +
                "</p></div>" + "<div class='container2'>" +
                "<i class='fas fa-trash color' onClick='deleteElement(" + JSON.stringify(i) + ")'></i>" + "</div> </div>" +
                "<div class='image'><img src=" + save[i].image + "  height='20%' width='30%' alt='image du livre' /> </div></div>"
        }
    } else {
        for (i = 0; i < storedArray.length; i++) {
            favori_book.innerHTML +=
                "<div class='card'>" +
                "<div class='container'><div class='container1'>" +
                "<p><b>Titre:" + storedArray[i].title + "</b></p>" +
                "<p><b><i>Id:" + storedArray[i].id + "</i></b></p>" +
                "<p>Auteur:" + storedArray[i].authors + "</p>" +
                "<p class='description'>Description:" +
                storedArray[i].description +
                "</p></div>" + "<div class='container2'>" +
                "<i class='fas fa-trash color' onClick='deleteElement(" + JSON.stringify(i) + ")'></i>" + "</div> </div>" +
                "<div class='image'><img src=" + storedArray[i].image + "  height='20%' width='30%' alt='image du livre' /> </div></div>"
        }
    }
}

function deleteElement(id) {

    if (save.length > 0) {
        for (var i = 0; i < save.length; i++) {
            if (i === id) {
                save.splice(i, 1);
                if (favori_book) {
                    favori_book.innerHTML = ""
                }
                sessionStorage.setItem('books', JSON.stringify(save));
                getStorage()

            }
        }
    } else {
        for (var i = 0; i < array_list[0].length; i++) {
            if (i === id) {
                array_list[0].splice(i, 1);
                if (favori_book) {
                    favori_book.innerHTML = ""
                }
                sessionStorage.setItem('books', JSON.stringify(array_list[0]));
                getStorage()

            }
        }
    }

}

function saveStorage(items) {
    let state = true
    favori_book.innerHTML = ""
    var storedArray = JSON.parse(sessionStorage.getItem("books"));
    if (storedArray) {
        for (i = 0; i < storedArray.length; i++) {
            if (storedArray[i].id === items.id) {
                alert("ce livre existe déja")
                state = false
                return state
            }
        }
        if (state) {

            save.push(items)
            sessionStorage.setItem('books', JSON.stringify(save));
            getStorage()
        }
    } else {
        save = []
        save.push(items)
        sessionStorage.setItem('books', JSON.stringify(save));
    }

}
window.addEventListener('DOMContentLoaded', init)