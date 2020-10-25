const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

//conexión local
//const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

const conectarDB = async () => {
    try {
        //conexión cloud mongodb
        await mongoose.connect(process.env.DB_MONGO, {
        //conexión local mongodb
        //await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('DB Conectada')
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1); // detener app
    }
}

module.exports = conectarDB;