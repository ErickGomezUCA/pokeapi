import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParse.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/pokemon', (req, res) => {
  res.render('pokemon');
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
