var express = require('express');
var app = express();


// Rutas
// callbacks: app.get('/', (req, res, nex))
// req: request - 
// res: response - 
// next(función): continua con la siguiente instrucción

app.get('/', (req, res, nex) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
})

module.exports = app;