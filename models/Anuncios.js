'use strict';

const mongoose = require('mongoose');

// primero creamos el esquema
const anuncioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    venta: { type: Boolean, index: true },
    precio: { type: Number, index: true },
    foto: String,
    tags: { type: String, enum: ['work', 'lifestyle', 'motor', 'mobile'] }
});

// creamos un metodo estatico
anuncioSchema.statics.list = function(filter, limit, start, sort) {
    //obtenemos la query sin ejecutarla
    const query = Anuncio.find(filter);
    query.limit(limit);
    query.skip(start);
    query.sort(sort);

    //ejecutamos la query y devolvemos una promesa
    return query.exec();
}

// y por ultimo creamos el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// y lo exportamos
module.exports = Anuncio;

