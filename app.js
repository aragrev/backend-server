// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// COnexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

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

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});