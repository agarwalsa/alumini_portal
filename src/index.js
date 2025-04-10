const express = require('express');
const connect = require('./config/database');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const cors = require("cors");


const apiRoutes = require('./routes/index');
const socketHandler = require("./sockets/chatSocket");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*", // change to frontend origin
      methods: ["GET", "POST"]
    }
  });



app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use('/api',apiRoutes);


socketHandler(io);
const PORT = 5001;
app.listen(PORT,async ()=>{
    console.log(`Server Running On Port ${PORT}`);
    await connect();
    console.log('mongo db is connected');
});