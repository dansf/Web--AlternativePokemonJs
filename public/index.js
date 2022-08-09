const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

// if (!('geolocation' in navigator)) {
//   window.alert('Geolocation unaveliable.');
//   console.log('Geolocation unaveliable.');
// }

const coloursPokemonType = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const getPokemon = async () => {
  const maxPokemons = 1154;
  const randomPoke = Math.random() * maxPokemons;

  const pokeData = await fetch('/poke');
  const pokeDataRes = await pokeData.json();
  const pokeInfo = await fetch(pokeDataRes.results[randomPoke.toFixed(0)].url);
  const pokeInfoRes = await pokeInfo.json();

  const Pokemon = {
    name: pokeInfoRes.name,
    type: pokeInfoRes.types,
    abilities: pokeInfoRes.abilities,
  };

  return Pokemon;
};

const backgroundType = (mainDiv, type) => {
  for (const typePoke in coloursPokemonType) {
    if (type == typePoke) {
      console.log(`Tipo enviado: ${type} | Tipo da lista: ${typePoke}`);
      mainDiv.style.backgroundColor = coloursPokemonType[typePoke];
    }
  }
};

const displayUserData = async () => {
  const pokemon = await getPokemon();
  // console.log(pokemon);

  const container = document.createElement('div');
  const mainDiv = document.querySelector('.weather');
  mainDiv.append(container);
  container.classList.add('user');

  const text = document.createElement('div');
  text.classList.add('text');
  const h2 = document.createElement('h2');

  const pokeTypesContainer = document.createElement('div');
  pokeTypesContainer.classList.add('pokeTypes');
  h2.textContent = `${pokemon.name}`;
  const ul = document.createElement('ul');
  pokeTypesContainer.append(ul);

  for (let i = 0; i < pokemon.type.length; i++) {
    const li = document.createElement('li');
    li.textContent = `${pokemon.type[i].type.name}`;
    ul.append(li);
  }

  backgroundType(mainDiv, pokemon.type[0].type.name);

  text.append(h2, pokeTypesContainer);
  container.append(text);
};

const appendInfos = async () => {
  const date = new Date();
  const dateNow = date.getDate();
  const monthNow = date.getMonth();
  const yearNow = date.getFullYear();
  const hourNow = date.getHours();
  const minutesNow = date.getMinutes();

  const update = document.querySelector('.update');
  const box = document.createElement('div');
  const pOne = document.createElement('p');
  const pTwo = document.createElement('p');
  const pThree = document.createElement('p');
  const spanDate = document.createElement('span');
  const spanHour = document.createElement('span');
  const spanPokemonName = document.createElement('span');
  box.append(pOne);
  box.append(pTwo);
  pThree.append(spanDate);
  pThree.append(spanHour);
  box.append(pThree);
  update.prepend(box);

  box.classList.add('box');
  // box.style.backgroundColor = getColors();
  pThree.classList.add('boxThree');

  // pOne.textContent = `Latitude: ${lat.toFixed(2)}°`;
  // pTwo.textContent = `Longitude: ${lon.toFixed(2)}°`;
  const pokemon = await getPokemon();
  spanPokemonName.textContent = pokemon.name;
  pOne.textContent = `Um passo para frente e encontrou: `;
  pOne.append(spanPokemonName);
  pTwo.textContent = ``;
  const minutesHour = minutesNow < 10 ? `0${minutesNow}` : minutesNow;
  const dateYear = dateNow < 10 ? `0${dateNow}` : dateNow;
  const monthYear = monthNow < 10 ? `0${monthNow + 1}` : monthNow + 1;
  spanDate.textContent = `${dateYear}/${monthYear}/${yearNow} - `;
  spanHour.textContent = `${hourNow}:${minutesHour}`;
};

// const getColors = () => {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

const getSateliteData = async () => {
  const dataSatelite = await fetch(API_URL);
  const resSatelite = await dataSatelite.json();
  return resSatelite;
};

const sendToDB = async data => {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };

  //* Fetch abaixo representa o envio das informações através do caminho "/api"
  fetch('/api', options);
};

var valuesReceived = {};

const sateliteData = async () => {
  try {
    const { latitude, longitude } = await getSateliteData();
    appendInfos(latitude, longitude);
    const data = { latitude, longitude };
    valuesReceived = data;
  } catch (e) {
    console.log(`${e}`);
  }
};

const btnSend = document
  .querySelector('.btn-infos')
  .addEventListener('click', async () => {
    //! Mudar para party de Pokemons
    // const divFav = document.createElement('div');
    // const pFavOne = document.createElement('p');
    // const pFavTwo = document.createElement('p');
    // const favorite = document.querySelector('.party');
    // favorite.append(divFav);
    // divFav.append(pFavOne, pFavTwo);
    // divFav.classList.add('box-favorite');
    // pFavOne.textContent = `Lat.: ${valuesReceived.latitude.toFixed(2)}°`;
    // pFavTwo.textContent = `Lon.: ${valuesReceived.longitude.toFixed(2)}°`;
    // ? Mudar para síncrono
    // await sendToDB(valuesReceived);
  });

const btnGet = document
  .querySelector('.btn-get')
  .addEventListener('click', async () => {
    const res = await fetch('/api', { method: 'GET' });
    const resData = await res.json();
    console.log(resData);
  });

const callsAPI = () => {
  //TODO: Salvar localmente ou no servidor os pokemons adquiridos
  sateliteData();
  displayUserData();
};

callsAPI();
// window.setInterval(callsAPI, 5000);
// window.setInterval(callsAPI,1800000);
