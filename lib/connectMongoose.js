'use strict';

// Cargamos mongoose
const mongoose = require('mongoose');
const conn = mongoose.connection;

conn.on('error', err => {
    process.exit(1);
});

conn.once('open', () => {
    console.log(`Conectado a MongoDB en ${mongoose.connection.name}`);
});

mongoose.connect('mongodb://localhost/nodepop', {
    useMongoClient: true
});

module.exports = conn;


