const express = require('express');
const connect = require('./config/database');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');



const apiRoutes = require('./routes/index');

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use('/api',apiRoutes);

const PORT = 5001;
app.listen(PORT,async ()=>{
    console.log(`Server Running On Port ${PORT}`);
    await connect();
    console.log('mongo db is connected');
});