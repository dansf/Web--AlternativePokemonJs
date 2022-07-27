import express from 'express';
import DataStore from 'nedb';

const PORT = process.env.PORT || 3000;
const LOCALHOST = process.env.LOCALHOST || 'http://localhost';
const app = express();

app.listen(PORT, () => console.log(`Listening in ${LOCALHOST}:${PORT}`));

app.use(express.static('public'));
app.use(express.json({ limit: '5mb' }));

const dataBase = new DataStore('database.db');
dataBase.loadDatabase();

app.post('/api', (req, res) => {
  const { latitude, longitude } = req.body;
  const date = new Date();
  const dateNow = date.getDate();
  const monthNow = date.getMonth();
  const yearNow = date.getFullYear();
  const hourNow = date.getHours();
  const minutesNow = date.getMinutes();

  const dataToSave = {
    Latitude: latitude.toFixed(2),
    Longitude: longitude.toFixed(2),
    date: dateNow,
    month: `0${monthNow + 1}`,
    year: yearNow,
    hour: hourNow,
    minutes: minutesNow,
  };

  // dataDeposit.unshift(dataToSave);
  dataBase.insert(dataToSave, e => {
    e ? console.log(`Error: ${e}`) : null;
  });

  res.json({
    status: 200,
    data: dataToSave,
  });
});

app.get('/api', (req, res) => {
  dataBase.find({}, (e, data) => {
    if (e) {
      console.log(`Error: ${e}`);
      return;
    }
    res.json(data);
  });
});

app.get("/color", (req, res) => {

})
