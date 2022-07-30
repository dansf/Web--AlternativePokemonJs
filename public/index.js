const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
// const API_WEATHER = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';

if (!('geolocation' in navigator)) {
  console.log('Geolocation unaveliable.');
}

var flagBox = true;

const appendInfos = (lat, lon) => {
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
  box.append(pOne);
  box.append(pTwo);
  pThree.append(spanDate);
  pThree.append(spanHour);
  box.append(pThree);
  update.prepend(box);

  const color = getColors();

  box.classList.add('box');
  box.style.backgroundColor = color;
  pThree.classList.add('boxThree');

  pOne.textContent = `Latitude: ${lat.toFixed(2)}°`;
  pTwo.textContent = `Longitude: ${lon.toFixed(2)}°`;
  spanDate.textContent = `${dateNow}/0${monthNow + 1}/${yearNow} - `;
  spanHour.textContent = `${hourNow}:${minutesNow}`;
};

const getColors = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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
  const dataFetch = await fetch('/api', options);
  const resFetch = await dataFetch.json();
};

const getWeatherData = async (latitude, longitude) => {
  const API_WEATHER = `/weather/${latitude},${longitude}`;
  const resWeather = await fetch(API_WEATHER);
  const jsonWeather = await resWeather.json();
  console.log(jsonWeather);
};

var valuesReceived = {};

const sateliteData = async () => {
  try {
    //! LIMITE DE REQUISIÇÔES: 3*24 = 72 + 1 = 73
    //TODO: Criar método para pegar a localização atual com computador e saber a temperatura
    const { latitude, longitude } = await getSateliteData();
    // getWeatherData(latitude, longitude);
    //TODO: Colocar o a Temperatura e local do satélite para aparecer na página
    appendInfos(latitude, longitude);
    //TODO: Acrescentar os atributos de temperatura e de local no objeto data
    const data = { latitude, longitude };
    valuesReceived = data;
  } catch (e) {
    console.log(`${e}`);
  }
};

const btnSend = document
  .querySelector('.btn-infos')
  .addEventListener('click', async () => {
    const divFav = document.createElement('div');
    const pFavOne = document.createElement('p');
    const pFavTwo = document.createElement('p');
    const favorite = document.querySelector('.favorites');
    favorite.append(divFav);
    divFav.append(pFavOne, pFavTwo);
    divFav.classList.add('box-favorite');
    pFavOne.textContent = `Lat.: ${valuesReceived.latitude.toFixed(2)}°`;
    pFavTwo.textContent = `Lon.: ${valuesReceived.longitude.toFixed(2)}°`;
    //? Mudar para síncrono
    await sendToDB(valuesReceived);
  });

const btnGet = document
  .querySelector('.btn-get')
  .addEventListener('click', async () => {
    const res = await fetch('/api', { method: 'GET' });
    const resData = await res.json();
    console.log(resData);
  });

var counterCalls = 0;
const callsAPI = () => {
  //TODO: Salvar localmente ou no servidor a quantidade de calls
  sateliteData();
  counterCalls += 1;
  console.log(counterCalls);
};

callsAPI();
// window.setInterval(callsAPI, 5000);
// window.setInterval(callsAPI,1800000);
