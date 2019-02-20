var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();

// Importar Schema de usuario
var Usuario = require('../models/usuario');
//Importar SEED
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //Crear un token
        usuarioBD.password = ':)';
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); // 14400 = 4 horas

        res.status(200).json({
            ok: true,
            message: 'Datos correctos',
            data: {
                usuarioFull: usuarioBD,
                id: usuarioBD._id,
                nombre: usuarioBD.nombre,
                email: usuarioBD.email,
                role: usuarioBD.role,
                token: token
            }
        });

    });

});






module.exports = app;