'use strict';

const mongoose = require('mongoose');

// primero creamos el esquema
const usuarioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    email: { type: String, index: true, unique: true },
    clave: String
});

// y por ultimo creamos el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

// y lo exportamos
module.exports = Usuario;
