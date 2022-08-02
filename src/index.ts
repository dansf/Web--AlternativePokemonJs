import express, { Request, Response } from 'express';
import DataStore from 'nedb';
// import dotenv from 'dotenv/config';

const PORT = process.env.PORT || 3000;
const LOCALHOST = process.env.LOCALHOST || 'http://localhost';
const app = express();

app.listen(PORT, () => console.log(`Listening in ${LOCALHOST}:${PORT}`));

app.use(express.static('./public'));
app.use(express.json({ limit: '5mb' }));

const dataBase = new DataStore('database.db');
dataBase.loadDatabase();

app.post('/api', (req: Request, res: Response) => {
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

app.get('/api', (req: Request, res: Response) => {
  dataBase.find({}, (e: Error, data: any) => {
    if (e) {
      console.log(`Error: ${e}`);
      return;
    }
    res.json(data);
  });
});

app.get('/weather/:latlon', async (req: Request, res: Response) => {
  try {
    const dataInfoReq = req.params.latlon.split(',');
    console.log(dataInfoReq);
    // const latitude = dataInfoReq[0];
    // const longitude = dataInfoReq[1];
    //! Colocar a API_KEY quando for usar
    // const API_WEATHER = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    // const resWeather = await fetch(API_WEATHER);
    // const jsonWeather = await resWeather.json();
    // res.json(jsonWeather);
  } catch (e) {
    console.log(e);
  }
});
