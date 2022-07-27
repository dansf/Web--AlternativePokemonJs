const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const API_COLOR = 'https://www.colr.org/json/scheme/random';

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
    // console.log(valuesReceived);
    const divFav = document.createElement("div")
    const pFavOne = document.createElement("p")
    const pFavTwo = document.createElement("p")
    document.querySelector(".favorites").append(divFav);
    divFav.append(pFavOne, pFavTwo);
    pFavOne.textContent = valuesReceived.latitude;
    pFavTwo.textContent = valuesReceived.longitude;
    await sendToDB(valuesReceived);
  });

const btnGet = document
  .querySelector('.btn-get')
  .addEventListener('click', async () => {
    const res = await fetch('/api', { method: 'GET' });
    const resData = await res.json();
    console.log(resData);
  });

window.setInterval(sateliteData, 5000);
