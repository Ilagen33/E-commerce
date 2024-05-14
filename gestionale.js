//Costanti per l'url dell'API e la chiave di autorizzazione
const url = "https://striveschool-api.herokuapp.com/api/product/"
const key = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhMjRmYjBiM2IyNTAwMTUxYjU0MzkiLCJpYXQiOjE3MTUwODY3NjAsImV4cCI6MTcxNjI5NjM2MH0.tRa62s9gug_d79Gkyhqtjuom2FK46USw_JKaSQ2e0Vw"

//Puntatori agli elementi del DOM
const productList = document.getElementById('list-products');
const addButton = document.getElementById('addButton');
const deleteButton = document.querySelectorAll('deleteBtn');
const changeButton = document.querySelectorAll('modificaBtn');
const divbottoniChangeAdd =document.getElementById('addChangeBtnDiv')
const btnAggiungiProd = document.getElementById('btnNewProd')
const form = document.getElementById('form');

//Al caricamento della pagina chiamo la funzione prodottiEsistenti
document.addEventListener("DOMContentLoaded", function () {
  prodottiEsistenti ();
});

//Con questa funzione eseguo il GET,prendo ogni (con il foreach) elemento all'interno, lo passo come parametro della funzione getprod
const prodottiEsistenti = async () => {
spinnerON();
await fetch(url, { headers: { "Authorization": key } })
  .then ((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404){
      throw new Error('Errore, risorsa non trovata,' + response.status);
    }else if (response.status === 500) {
      throw new Error('Errore del server,' + response.status);
    } else {
      throw new Error('Errore nel recupero dei prodotti');
    }
    })

    //Se il caricamento va a buon fine passo i prodotti nel foreach
  .then ((products) => {
    spinnerOFF();
    messageON("Prodotti Caricati!")
    console.log(products);
    productList.innerHTML = " ";
    //per ogni prodotti passo i dati alla funzione getprod
    products.forEach((product) => {
    getprod(product);
    console.log("Prodotti Caricati!");
    });
  })

  .catch((error) => {
    spinnerOFF();
    console.error("Errore nel caricamento dei prodotti:", error.message);
    alert("Si è verificato un errore durante il recupero dei prodotti. Si prega di riprovare più tardi.");
    messageON("Prodotti non caricati, riprova più tardi");
  });
}

//Con questa funzione creo gli elementi della lista di prodotti che visualizzerò in html
//per inserire classi ho utilizzato classList.add e per aggiungere l'attributo src all'immagine ho usato setAttribute
function getprod (product) {
  //creo il div che conterrà le info del prodotto
  const prodottoNew = document.createElement('div');
  prodottoNew.classList.add('prod-list');

  //per ogni elemento che invio con il form creo un tag e inserisco il valore corrispondente con innerText

  //NAME
  const name= document.createElement('h5');
  name.innerText = product.name;

  //IMG
  const img = document.createElement('img');
  img.src = product.imageUrl;

  //DESCRIPTION
  const dec = document.createElement('p')
  dec.innerText = product.description;

  //BRAND
  const brand = document.createElement('span')
  brand.innerText = product.brand;

  //PRICE
  const price = document.createElement('h6')
  price.innerText = "$" + product.price;

  //inserisco inoltre un div che conterrà due bottoni
  const divBtn = document.createElement('div')
  divBtn.classList.add('btn-container')

  //questo bottone sarà utilizzato per la modifica dei dati del prodotto
  const modBtn = document.createElement('button')
  modBtn.classList.add('modificaBtn','btn', 'btn-warning', 'rounded-pill')
  modBtn.setAttribute('data-bs-toggle', 'collapse');
  modBtn.setAttribute('type', 'button');
  modBtn.setAttribute('data-bs-target', '#form')
  //inserisco il link per tornare al form
  modBtn.innerHTML = '<a href="#">Modifica</a>';

  //questo bottone sarà utilizzatoper eliminare il prodotto
  const delBtn = document.createElement('button');
  delBtn.classList.add('deleteBtn', 'btn', 'btn-danger', 'rounded-pill')
  //inserisco il link per tornare al form
  delBtn.innerHTML = '<a href="#">Elimina</a>';

  //console di controllo
  console.log(`Ecco l'ID del prodotto ${product._id}`)
  console.log (name, dec, img, brand, price);

  //"appendo" il div contenitore dei dati poi le informazioni e poi il div che conterrà i bottoni infine ci inserisco i bottoni
  prodottoNew.appendChild(name);
  prodottoNew.appendChild(img)
  prodottoNew.appendChild(dec);
  prodottoNew.appendChild(brand);
  prodottoNew.appendChild(price)
  productList.appendChild(prodottoNew)
  prodottoNew.appendChild(divBtn);
  divBtn.appendChild(modBtn);
  divBtn.appendChild(delBtn);

  //aggiungo l'evet listener
  //al click il bottone Modifica viene messo in display: none
  //viene ripulito il div che continete i bottoni del form
  //poi viene mandato come parametro il product alla funzione changeProd
  //invio direttamente tutto il prodotto per avere tutti i dati necessari
  modBtn.addEventListener('click', function () {
    addButton.className ='d-none';
    addChangeBtnDiv.innerHTML = '';
    changeProd(product);
  })

  //aggiungo l'event listener
  //al click sul bottone Elimina viene mandato il product come parametro alla funzione deleteProd 
  //invio direttamente il prodotto così da evitare altre chiamate al server, avendo a disposizione qui tutti i dati a disposizione
  delBtn.addEventListener('click', function () {
    deleteProd(product)
  })
}

//aggiungo l'event listener
//al click sul bottone + 
//con preventDefault evito di aggiornare la pagina
//creo l'oggetto newProduct, ricavo i dati da inserire al suo interno dai campi del form
addButton.addEventListener('click', function(event) {
  console.log('Click su Add');
  event.preventDefault();

  //faccio delle verifiche sul prezzo inserito, converto la stringa in numero decimale
  const inPrice = parseFloat(document.getElementById('price').value);
  //così posso verificare se è stato inserito un numero e se è maggiore di zero
  if (isNaN(inPrice) || inPrice <= 0  || !(/^\d+(\.\d{1,2})?$/.test(inPrice))) {
    alert('Il prezzo non è un numero positivo, riprova con un numero valido')
  }

  //Creo un oggetto dai dati inseriti nel form
  const newProduct = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    imageUrl: document.getElementById('imageUrl').value,
    brand: document.getElementById('brand').value,
    price: inPrice
    }

  //infine faccio un controllo con il console.log
  //mando come parametro l'oggetto appena creato alla funzione sendProduct
  console.log(newProduct);

  //RIchiedo conferma per continuare l'operazione
  if (confirm(`Sicuro di voler aggiungere questo prodotto: ${newProduct.name}?`)) {
    //se va a buon fine passo l'oggetto creato alla funzione che effettua il post
    sendProduct(newProduct);
    }
});

//inviato l'oggetto in questa funzione, ulitizzo il metodo POST per creare un nuovo elemento da caricate sul server
const sendProduct = async(newP) =>  {
spinnerON();
await fetch("https://striveschool-api.herokuapp.com/api/product/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": key},
    body: JSON.stringify(newP)
  }
)
//controllo delle risposte
.then(response => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 404) {
    throw new Error('Risorsa non trovata' + response.status);
  } else if (response.status === 500) {
    throw new Error('Errore del server' + response.status);
  } else {
    throw new Error('Errore durante la aggiunta del prodotto' + response.status);
  }
})
//se va a buon fine la richiesta, ricarico la pagina in modo tale che la funzione carica gli oggetti e li inserisce in HTML
//inserisce anche il nuovo oggetto
.then((newProduct) => {
  window.location.reload();
  spinnerOFF();
  messageON("Prodotto aggiunto con successo!")
  console.log("Prodotto aggiunto con successo!", newProduct);
})
//se non va a buon fine stampra messaggio di errore in console
.catch((error) => {
  console.error("Errore durante l'aggiunta del prodotto:", error.message);
  alert("Si è verificato un errore durante l'aggiunta del prodotto. Si prega di riprovare più tardi.");
  spinnerOFF();
  messageON("Errore!");
});

}
//funzione chiamata al click sul bottone modifica
 function changeProd (prod) {
  console.log('Modifico!')

  //definisco il testo dell'input nei dati dell'oggetto
  document.getElementById('name').value = prod.name
  document.getElementById('description').value = prod.description
  document.getElementById('imageUrl').value = prod.imageUrl
  document.getElementById('brand').value = prod.brand
  const inPrice = parseFloat(document.getElementById('price').value = prod.price)
  console.log(inPrice) ; //verifico se è stato inserito un numero e se è maggiore di zero (i prezzi sono ovviamente sempre positivi)
  if (isNaN(inPrice) || inPrice <= 0) {
    //alert prezzo sbagliato
    alert('Il prezzo non è un numero positivo, riprova con un numero valido')
  }
  const id = prod._id;
  //creo un bottone (uguale a quello di Add ma giallo) per la modifica
  const changeBtn = document.createElement('button');
  changeBtn.className = 'changeBtn rounded-pill m-2 d-flex justify-content-between align-items-center btn-warning btn pb-2';
  changeBtn.innerHTML = '<i class="bi bi-plus"></i>';
  //lo aggiungo al di sotto del form
  divbottoniChangeAdd.appendChild(changeBtn);

  //gli aggiungo l'event listener
  changeBtn.addEventListener('click', function (event) {
    //al click evito di far ricare la pagine
    event.preventDefault();
    if (confirm(`Sicuro di voler effettuare queste modifiche?`)) {
    //passo  il prodotto come parametro alla funzione sendChangeProd
    sendChangeProd (prod, id)
    }
  })
}

function sendChangeProd (product) {
  //recupero l'id del prodotto
  const id = product._id;
  console.log(id);
  // approssimo il valore in decimale
  const inPrice = parseFloat(document.getElementById('price').value);
  //verifico se è stato inserito un numero e se è maggiore di zero (i prezzi sono ovviamente sempre positivi)
  if (isNaN(inPrice) || inPrice <= 0) {
    //alert prezzo sbagliato
    alert('Il prezzo non è un numero positivo, riprova con un numero valido')
  }
  //creo un nuovo oggetto, di cui i parametri saranno presi dall'oggetto passato come parametro (l'oggetto modificato)
  const changedProduct = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    imageUrl: document.getElementById('imageUrl').value,
    brand: document.getElementById('brand').value,
    price: inPrice
}
console.log(changedProduct, id);
//invio l'oggetto modificato e il suo id come parametri alla funzione invio Modifiche
invioModifiche(changedProduct, id)
}

//invio al server con il metodo put per modificare
const invioModifiche = async(prod, id) => {
  spinnerON();
  await fetch("https://striveschool-api.herokuapp.com/api/product/" + id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: key},
      body: JSON.stringify(prod),
  })
  //verifico la response
   .then((response) => {
    spinnerOFF();
    if (response.ok) {
      console.log("Prodotto modificato con successo!" + response);
      messageON("Prodotto modificato!")
      window.location.reload()
    } else if ( response.status === 404) {
      throw new Error('Errore risorsa non trovata ' + response.status);
    } else if ( response.status === 500) {
      throw new Error('Errore del server' + response.status);
    } else {
      throw new Error('Errore durante la modifica del prodotto: ' + response.status);
    }
  })
  .catch((error) => {
    spinnerOFF();
    console.error("Errore durante la modifica del prodotto:", error.message);
    alert("Si è verificato un errore durante la modifica del prodotto. Si prega di riprovare più tardi.");
    messageON("Prodotto non modificato, riprova più tardi")
  });

}

//funzione chiamata al click sul bottone Elimina
function deleteProd(prod) {
  //messaggio di conferma dell'eleminazione
  if (confirm(`Sicuro di voler eliminare questo prodotto: ${prod.name}?`)) {
  //invio solo l'id del prodotto come parametro alla funzione (unico dato che serve)
  invioDelete(prod._id)
}
}

// elimino dal server il prodotto all'id corrispondente con il metodo delete
const invioDelete  = async(id) => {
  spinnerON();
  console.log('Elimino!')

  fetch("https://striveschool-api.herokuapp.com/api/product/" + id, {
    method: "DELETE",
    headers: {
    authorization: key},
  })
  .then(response => {
    spinnerOFF();
    //verifica della response
    if (response.ok) {
      console.log("Prodotto eliminato con successo");
      messageON("Prodotto Eliminato!")
      window.location.reload();
    } else if (response.status === 404) {
      throw new Error('Risorsa non trovata' + response.status);
    } else if (response.status === 500) {
      throw new Error('Errore del server' + response.status);
    } else {
      throw new Error("Errore durante l'eliminazione del prodotto" + response.status);
    }
  })
  .catch((error) => {
    console.error("Errore durante l'eliminazione del prodotto:", error.message);
    alert("Si è verificato un errore durante l'eliminazione del prodotto. Si prega di riprovare più tardi.");
    messageON("Prodotto non eliminato, riprova più tardi!")
  });
}

//cliccando sul tasto per aggiungere i dati al form,
// i suoi campo si resettano (se cliccassi su modifica e alla fine non facessi più modifiche, 
//nel form rimarrebbero i dati del prodotto selezionato prima, in questo modo è vuoto)
btnAggiungiProd.addEventListener('click', function() {
  form.reset();
}) 

//Funzionalità spinner
//vedo lo spinner al caricamento

//creo la funzione per visualizzare lo spinner
function spinnerON () {
  document.getElementById('spinner').style.display = 'block';
}

//creo la funzione per non visualizzare più lo spinner
function spinnerOFF () {
  document.getElementById('spinner').style.display = 'none';
}

//Funzionalità message
// Funzione per mostrare un messaggio
function messageON(messaggio, success = true) {
  const messageBox = document.getElementById("message-box");
  messageBox.textContent = messaggio;

  if (success) {
    messageBox.classList.remove("alert-danger");
    messageBox.classList.add("alert-success");
  } else {
    messageBox.classList.remove("alert-success");
    messageBox.classList.add("alert-danger");
  }

  messageBox.style.display = "block";

  // Il messaggio scompare dopo 5 secondi
  setTimeout(() => {
      messageBox.style.display = "none";
  }, 5000);
};