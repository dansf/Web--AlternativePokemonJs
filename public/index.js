const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

if (!('geolocation' in navigator)) {
  console.log('Geolocation unaveliable.');
}

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
update.append(box);

const appendInfos = (lat, lon) => {
  const date = new Date();
  const dateNow = date.getDate();
  const monthNow = date.getMonth();
  const yearNow = date.getFullYear();
  const hourNow = date.getHours();
  const minutesNow = date.getMinutes();

  // pOne.classList.add('.lat');
  pOne.textContent = `Latitude: ${lat.toFixed(2)}°`;

  // pTwo.classList('.lon');
  pTwo.textContent = `Longitude: ${lon.toFixed(2)}°`;

  // spanDate.classList.add('.date');
  spanDate.textContent = `${dateNow}/0${monthNow + 1}/${yearNow}`;

  // spanHour.classList.add('.hour');
  spanHour.textContent = `${hourNow}:${minutesNow}`;
};

const getSateliteData = async () => {
  let dataSatelite = await fetch(API_URL);
  let resSatelite = await dataSatelite.json();
  return resSatelite;
};

const sendToDB = async data => {
  let options = {
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
