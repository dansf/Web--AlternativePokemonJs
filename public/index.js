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

const backgroundType = type => {
  for (const typePoke in coloursPokemonType) {
    if (type == typePoke) return coloursPokemonType[typePoke];
  }
};

const mouseoverEvent = (appendPokemon, pokemon) => {
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
};

const getPokemon = async () => {
  const maxPokemons = 1154;
  const randomPoke = Math.random() * maxPokemons;

  const pokeData = await fetch(API_POKEMON);
  const pokeDataRes = await pokeData.json();
  const pokeInfo = await fetch(pokeDataRes.results[randomPoke.toFixed(0)].url);
  const pokeInfoRes = await pokeInfo.json();
  // console.log(pokeInfoRes.forms[0].url);
  const pokeFormUrl = await fetch(pokeInfoRes.forms[0].url);
  const pokeFormUrlRes = await pokeFormUrl.json();
  // console.log(pokeFormUrlRes);

  const Pokemon = {
    name: pokeInfoRes.name,
    type: pokeInfoRes.types,
    abilities: pokeInfoRes.abilities,
    img: pokeInfoRes.sprites.front_default,
    mega: pokeFormUrlRes.is_mega,
  };

  return Pokemon;
};

const displayPokemonsFound = async () => {
  for (let i = 1; i <= 3; i++) {
    const pokemon = await getPokemon();
    // console.log(pokemon);

    if (pokemon.mega) pokemon = await getPokemon();
    else {
      const appendPokemon = document.querySelector(`.box:nth-child(${i})`);
      const boxInfos = document.createElement('div');
      const h2 = document.createElement('h2');
      const types = document.createElement('ul');
      const abilities = document.createElement('ul');
      const img = document.createElement('img');

      h2.textContent = pokemon.name.split('-')[0];

      mouseoverEvent(appendPokemon, pokemon);

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

      img.src = pokemon.img;
      boxInfos.append(h2, types, abilities);
      appendPokemon.append(img, boxInfos);
    }
  }
};

document.querySelector('.btn-rollPokemon').addEventListener('click', () => {
  const boxes = document.querySelectorAll('.box');
  boxes.forEach(box => {
    var child = box.lastElementChild;
    var flag = true;

    while (child && flag) {
      box.removeChild(box.lastElementChild);
      child = box.lastElementChild;
    }

    flag = false;
  });
  displayPokemonsFound();
});

//TODO: Salvar localmente ou no servidor os pokemons adquiridos
// sateliteData();
displayPokemonsFound();

// =========== SATELLITE SECTION ================

const sendToDB = async data => {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };

  //* Fetch abaixo representa o envio das informações através do caminho "/api"
  fetch('/api', options);
};

const getSateliteData = async () => {
  const dataSatelite = await fetch(API_URL);
  const resSatelite = await dataSatelite.json();
  return resSatelite;
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
