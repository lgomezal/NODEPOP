'use strict';

const express = require('express');
const router = express.Router();
const jwtAuth = require('../../lib/jwtAuth');

// cargar el modelo de Anuncios
const Anuncios = require('../../models/Anuncios');

// JWT
router.use(jwtAuth());

/**
 * GET /anuncios
 * obtener una lista de anuncios
 */
router.get('/', async (req, res, next) => {
    try {
        // creo el filtro vacio
        const filter = {};
        const tag = req.query.tag;
        const venta = req.query.venta;
        const nombre = req.query.nombre;
        const precio = req.query.precio;
        // Recogemos el lenguaje de la petición, si no existe asignamos el por defecto
        const lang = req.query.lang || process.env.LANG_DEFAULT;

        let limit = parseInt(req.query.limit);
        if (!limit) {
            limit = 20;
        }
        console.log(limit);
        const start = parseInt(req.query.start);
        const sort = req.query.sort;
        
        // Compruebo que venga tag
        if (tag) {
            filter.tags = tag;
        } 

        // Compruebo que venga venta
        if (venta) {
            filter.venta = venta;
        } 

        // Compruebo que venga nombre o parte del mismo
        if (nombre) {
            // Creo la expresión regular para el nombre
            filter.nombre = new RegExp('^' + nombre, "i");
        }

        // Compruebo que venga algun valor en precio
        if (precio) {
            const numero = precio.search('-');
            if (numero !== -1) {
                const regexNumero = precio.split('-');
                const $gte = parseFloat(regexNumero[0]);
                const $lte = parseFloat(regexNumero[1]);
            
                if (isNaN($lte)) {
                    filter.precio = {$gte};
                } else if (isNaN($gte)) {
                    filter.precio = {$lte};
                } else {
                    filter.precio = {$gte, $lte};
                }
            } else {
                filter.precio = precio;
            }
        }

        // Consultamos los anuncios de la base de datos
        const rows = await Anuncios.list(filter, limit, start, sort);
        res.json({success: true, result: rows});
    } catch(err) {
        next(err);
    }
});

/**
 * GET /tags
 * obtener una lista de tags
 */
router.get('/tags', async (req, res, next) => {
    try {
        // Consultamos los tags de los anuncios de la base de datos
        const tags = await Anuncios.distinct('tags').exec(function(err, tags) {
            if (err) {
                next(err);
                return;
            }
            res.json({success: true, result: tags});
        })
        
    } catch(err) {
        next(err);
    }
});

module.exports = router;