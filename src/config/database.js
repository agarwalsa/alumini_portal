const mongoose = require('mongoose');
const connect = async()=>{
    await mongoose.connect('mongodb+srv://authdb:99999@cluster0.plibeu4.mongodb.net/alumLink');

}
module.exports = connect;