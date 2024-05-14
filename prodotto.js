//Costanti per l'url dell'API e la chiave di autorizzazione
const url = "https://striveschool-api.herokuapp.com/api/product/"
const key = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhMjRmYjBiM2IyNTAwMTUxYjU0MzkiLCJpYXQiOjE3MTUwODY3NjAsImV4cCI6MTcxNjI5NjM2MH0.tRa62s9gug_d79Gkyhqtjuom2FK46USw_JKaSQ2e0Vw"

//Ricavo l'id prodotto dalla URL
const dati = window.location.search;
const params = new URLSearchParams(dati);
const codedDati= params.get('dati');
const decodeDati = decodeURIComponent(codedDati);
const datiJS = JSON.parse(decodeDati);
const container = document.getElementById('info-product');

//Al caricamnento del DOM faccio partire la funzione della fetch (GET)
document.addEventListener("DOMContentLoaded", function () {
    getProdotti ()
  })
  
//con questa funzione ottengo i prodotti dal server
const getProdotti = async () => {
await fetch(url + datiJS, {headers: {authorization: key}})
  .then ((response) => {return response.json()})
  .then ((product) => {
    console.log(product)
    //per ognuno di questi, faccio partire la funzione getInfo in cui passo come parametro i loro dati
    getInfo(product);
    console.log("Prodotti Caricati!")
  })
  .catch((error) => console.error("Ops...", error));
}

//Funzione che inserisce i dati del prodotto in HTML
function getInfo(product) {
    //controllo che il prodotto sia passato correttamente
    console.log(product);

    //div dell'immagine
    const divHead = document.createElement('div')

    //div delle informazioni
    const divInfo = document.createElement('div');
    divInfo.className = "info";

    //inserisco i due div
    container.appendChild(divHead);
    container.appendChild(divInfo);

    //titolo (nome prodotto)
    const title = document.createElement('h1');
    title.innerText = product.name;

    //immagine head della card
    const img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    divHead.appendChild(img);

    //descrizione del prodotto
    const dec = document.createElement('h4');
    dec.innerText = product.description;

    //brand del prodotto
    const brand = document.createElement('h6');
    brand.innerText = product.brand;
    
    //Prezzo del prodotto
    const price = document.createElement('p');
    price.innerText = "$" + product.price;

    //inserisco i dati all'interno dei div della card
    divInfo.appendChild(title)
    divInfo.appendChild(dec);
    divInfo.appendChild(brand);
    divInfo.appendChild(price);

    //creao un div per inserire dei bottoni estetici (nella lista dei to do da implementare)
    const buttonDiv= document.createElement('div');
    divInfo.appendChild(buttonDiv);

    //bottone per la funzionalità per salvare i dati tra i piaciuti
    const buttonSave = document.createElement('button');
    buttonSave.classList.add('save', 'btn', 'btn-dark', 'rounded-pill');
    buttonSave.innerHTML= '<i class="bi bi-heart"></i>';

    //bttone per la funzionalità per salvare i dati nel carrello
    const cartButton = document.createElement('button');
    cartButton.classList.add('cart', 'btn', 'btn-light', 'rounded-pill');
    cartButton.innerHTML= '<i class="bi bi-bag"></i>';

    //inserisco i bottoni nel div contenitore di btn
    buttonDiv.appendChild(buttonSave);
    buttonDiv.appendChild(cartButton);
}
