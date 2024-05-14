//SHORTCUT
const url = 'https://striveschool-api.herokuapp.com/api/product/'
const key = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhMjRmYjBiM2IyNTAwMTUxYjU0MzkiLCJpYXQiOjE3MTUwODY3NjAsImV4cCI6MTcxNjI5NjM2MH0.tRa62s9gug_d79Gkyhqtjuom2FK46USw_JKaSQ2e0Vw"

//POINTER
const prodCard = document.getElementById('card-container')

//Funzione che al caricamento della pagina richiama la funzione get prodotti
document.addEventListener("DOMContentLoaded", function () {
  getProdotti ()
})

//con questa funzione ottengo i prodotti dal server
const getProdotti = async () => {
await fetch(url, {headers: {authorization: key}})
  .then ((response) => {return response.json()})
  .then ((products) => {
    console.log(products)
    //per ognuno di questi, faccio partire la funzione getInfo in cui passo come parametro i loro dati
    products.forEach((product) => {
    getInfo(product);
    console.log("Prodotti Caricati!")
    });
  })
  .catch((error) => console.error("Ops...", error));
}

//Funzione inserisci prodotto
function getInfo (product) {

//Con questa funzione creo gli elementi della lista di prodotti che visualizzerò in html
//per inserire classi ho utilizzato classList.add e per aggiungere l'attributo src all'immagine ho usato setAttribute
  const col = document.createElement ('div');
  col.classList.add('col');

  const card = document.createElement('div');
  card.classList.add('cardMe');

 const img = document.createElement('img');
  img.setAttribute('src', product.imageUrl);

 const divText = document.createElement('div');
 divText.classList.add('body-card');
 
 const name= document.createElement('h5');
  name.innerText = product.name;

  const dec = document.createElement('p');
  dec.innerText = product.description;
  
  const brand = document.createElement('span');
  brand.innerText = product.brand;
 
  const price = document.createElement('h6');
  price.innerText = "$" + product.price;

  //Controllo
  console.log (name, dec, img, brand, price);

  //Una volta controllati, aggiungo tutto nella card
  card.appendChild(img);
  divText.appendChild(name);
  divText.appendChild(dec);
  divText.appendChild(brand);
  divText.appendChild(price);
  prodCard.appendChild(col);
  col.appendChild(card);
  card.appendChild(divText);
  
  //Aggiunta di bottoni utili a salvare e un div che li contiene
  const btnSpace = document.createElement('div');
  btnSpace.classList.add('btnDiv')

  const cart = document.createElement('button');
  cart.classList.add('cart', 'btn', 'btn-light', 'rounded-pill');
  cart.innerHTML = '<i class="bi bi-heart"></i>';

  const save = document.createElement('button');
  save.classList.add('save', 'btn', 'btn-dark', 'rounded-pill');
  save.innerHTML = '<i class="bi bi-bag"></i>';

  //aggiungo il div alla card e al suo interno i bottoni
  card.appendChild(btnSpace);
  btnSpace.appendChild(cart);
  btnSpace.appendChild(save);

  const id = product._id; 

  card.addEventListener('click', function () {
    const productString = JSON.stringify(id);
    const codedproduct = encodeURIComponent(productString)
    window.location.href = './prodotto.html?dati=' + codedproduct;
  })
};

