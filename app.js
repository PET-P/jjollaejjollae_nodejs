require('dotenv').config();
const express = require('express');

const {PORT} = process.env;
app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/', (req, res) => res.send('!!!HELLO JJOLLAE!!!'));



app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));