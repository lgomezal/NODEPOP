'use strict';

const express = require('express');
const router = express.Router();
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const eValidator = require('email-validator');
const customError = require('../../lib/customError');

// cargar el modelo de Usuarios
const Usuarios = require('../../models/Usuarios');

/**
 * POST /usuario/authenticate
 * Autentica un usuario
 */
router.post('/authenticate', (req, res, next) => {
    // Recogemos el lenguaje de la petición, si no existe asignamos el por defecto
    const lang = req.body.lang || process.env.LANG_DEFAULT;

    // Recogemos las credenciales
    const email = req.body.email;
    const clave = req.body.clave;

    // Validamos que el email esté dado de alta
    Usuarios.findOne({ email: email }).exec(function(err, usuario) {
        if (err) {
            next(err);
            return;
        }
        if (usuario) {
            // Validamos que la clave sea la misma
            if (sha256(clave) !== usuario.clave) {
                const message=({ 
                    code: 454,
                    msg: customError[454][lang]
                });
                return res.status(401).json({success: false, error: message});
            }
        } else {
            const message=({ 
                code: 454,
                msg: customError[454][lang]
            });
            return res.status(401).json({success: false, error: message}); 
        } 
        // si el usuario existe y la password coincide
        // Creamos un token
        // No firmar con objetos de mongoose, usar mejor un nuevo objeto solo con lo minimo
        jwt.sign({ user_id: usuario._id}, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }, 
            (err, token) => {
                if (err) {
                    next(err);
                    return;
                }
                // y lo devolvemos
                res.json({ success: true, token: token});
            });
    }); 
});

/**
 * POST /usuario/registro
 * Crea un usuario
 */
router.post('/registro', (req, res, next) => {
    // Recogemos el lenguaje de la petición, si no existe asignamos el por defecto
    const lang = req.body.lang || process.env.LANG_DEFAULT;

    // recuperamos los datos del usuario del body
    if (!req.body.nombre || !req.body.email || !req.body.clave) {
        const message=({ 
            code: 451,
            msg: customError[451][lang]
        });
        return res.status(401).json({success: false, error: message});
    }

    if (!eValidator.validate(req.body.email)) {
        const message=({ 
            code: 452,
            msg: customError[452][lang]
        });
        return res.status(401).json({success: false, error: message});
    }

    // Validamos que el email no esté dado de alta anteriormente
    const email = req.body.email;
    Usuarios.findOne({ email: email }).exec(function(err, usuario) {
        if (err) {
            next(err);
            return;
        }
        if (usuario) {
            const message=({ 
                code: 453,
                msg: customError[453][lang]
            });
            return res.status(401).json({success: false, error: message});
        } else {
            const usuario = new Usuarios ({
                nombre: req.body.nombre,
                email: req.body.email,
                clave: sha256(req.body.clave)
            })
        
            // lo persistimos en la coleccion de usuarios
            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    next(err);
                    return;
                }
                res.json({success: true, result: usuarioGuardado});
            })
        }
    }); 

});

module.exports = router;

