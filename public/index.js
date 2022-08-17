const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const API_POKEMON = `https://pokeapi.co/api/v2/pokemon/?limit=1154`;

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

  const pokeData = await fetch(API_POKEMON);
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

const backgroundType = type => {
  for (const typePoke in coloursPokemonType) {
    if (type == typePoke) {
      console.log(`Tipo enviado: ${type} | Tipo da lista: ${typePoke}`);
      return coloursPokemonType[typePoke];
    }
  }
};

const displayPokemonsFound = async () => {
  for (let i = 1; i <= 3; i++) {
    const pokemon = await getPokemon();
    // console.log(pokemon);

    const appendPokemon = document.querySelector(`.box:nth-child(${i})`);
    const h2 = document.createElement('h2');
    const types = document.createElement('ul');
    const abilities = document.createElement('ul');

    appendPokemon.addEventListener('mouseover', () => {
      //! Trocar o tipo de Listener
      appendPokemon.style.boxShadow = `-10px 10px 1px .5px ${backgroundType(
        pokemon.type[0].type.name,
      )}`;
      appendPokemon.style.left = '5px';
      appendPokemon.style.bottom = '5px';
    });

    appendPokemon.addEventListener('mouseout', () => {
      //! Trocar o tipo de Listener
      appendPokemon.style.boxShadow = null;
      appendPokemon.style.left = null;
      appendPokemon.style.bottom = null;
    });

    h2.textContent = pokemon.name.split('-')[0];

    for (let i = 0; i < pokemon.type.length; i++) {
      const li = document.createElement('li');
      li.textContent = pokemon.type[i].type.name;
      types.append(li);
    }

    for (let i = 0; i < pokemon.abilities.length; i++) {
      const li = document.createElement('li');
      const small = document.createElement('small');
      small.textContent = pokemon.abilities[i].ability.name;
      li.append(small);
      abilities.append(li);
    }

    appendPokemon.append(h2, types, abilities);
  }
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

// const btnSend = document
//   .querySelector('.btn-infos')
//   .addEventListener('click', async () => {
//     ! Mudar para party de Pokemons
//     const divFav = document.createElement('div');
//     const pFavOne = document.createElement('p');
//     const pFavTwo = document.createElement('p');
//     const favorite = document.querySelector('.party');
//     favorite.append(divFav);
//     divFav.append(pFavOne, pFavTwo);
//     divFav.classList.add('box-favorite');
//     pFavOne.textContent = `Lat.: ${valuesReceived.latitude.toFixed(2)}°`;
//     pFavTwo.textContent = `Lon.: ${valuesReceived.longitude.toFixed(2)}°`;
//     ? Mudar para síncrono
//     await sendToDB(valuesReceived);
//   });

// const btnGet = document
//   .querySelector('.btn-get')
//   .addEventListener('click', async () => {
//     const res = await fetch('/api', { method: 'GET' });
//     const resData = await res.json();
//     console.log(resData);
//   });

const callsAPI = () => {
  //TODO: Salvar localmente ou no servidor os pokemons adquiridos
  // sateliteData();
  displayPokemonsFound();
};

callsAPI();
// window.setInterval(callsAPI, 5000);
// window.setInterval(callsAPI,1800000);
