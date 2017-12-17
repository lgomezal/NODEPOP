'use strict';
// Cargo el archivo json a cargar
const json = require('../anuncios.json');
//Cargo el cliente de mongodb
const { MongoClient } = require('mongodb');

//Creo la conexión a la base de datos
MongoClient.connect('mongodb://localhost/nodepop', (err, db) => {
    if (err) {
        return console.log('Error al conectar a mongoDB');
    }
    
    //Borro las tablas si existen
    db.collection('anuncios').drop(({}, err) => {
        //Compruebo error
        if (err) {
            return console.log('Error al borrar colección anuncios');
        }
        console.log('Colección de anuncios borrada correctamente');
    });
    
    db.collection('usuarios').drop(({}, err) => {
        //Compruebo error
        if (err) {
            return console.log('Error al borrar colección usuarios');
        }
        console.log('Colección de usuarios borrada correctamente');
    });
    
    //Cargo la colección de anuncios en la base de datos
    db.collection('anuncios').insertMany(json.anuncios, function(err, results) {
        if (err) {
            return console.log('Error al insertar colección anuncios');
        }
        console.log('Colección de anuncios insertada correctamente', results);
    });

    db.close();
    
});