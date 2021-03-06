require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const passport = require('passport');
const passportConfig = require('./middleware/passport');
const fs = require('fs')
const path = require('path')

const { PORT, MONGO_URI } = process.env;
app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(err => console.error(err));

app.use(logger('dev'));

app.use(logger('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

app.use(passport.initialize());
passportConfig();

app.use('/api', require('./api'));
app.get('/', (req, res) => res.send('!!!HELLO JJOLLAE!!!'));



app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));