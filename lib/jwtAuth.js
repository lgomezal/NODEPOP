'use strict';

const jwt = require('jsonwebtoken');
const customError = require('../lib/customError');

// Exportamos un creador de middlewares de autenticacion
module.exports = () => {
    return function(req, res, next) {
        // leer credenciales
        const token = req.body.token || req.query.token || req.get('x-access-token');
        // Recogemos el lenguaje de la petición, si no existe asignamos el por defecto
        const lang = req.query.lang || req.body.lang || process.env.LANG_DEFAULT;
        
        if (!token) {
            const message=({ 
                code: 455,
                msg: customError[455][lang]
            });
            return res.status(401).json({success: false, error: message});
        }

        // Comprobar credenciales
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                const message=({ 
                    code: 455,
                    msg: customError[455][lang]
                });
                return res.status(401).json({success: false, error: message});
            }
            // Continuar
            req.userId = decoded.user_id; // lo guardamos en request para los siguientes midelwares
            next();
        });        
    }
}
