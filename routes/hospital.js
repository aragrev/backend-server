var express = require('express');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// Importar Schema de hospital
var Hospital = require('../models/hospital');

//==========================================
// Obtener todos los hospitales
//==========================================
app.get('/', (req, res, nex) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, 'nombre img usuario')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });
            }
        );
});

//==========================================
// Actualizar usuario
//==========================================
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalActualizado
            });
        });
    });
});

//==========================================
// Crear un nuevo hospital
//==========================================
app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body; // Extrae el contenido del body
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al registrar hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

//==========================================
// Eliminar hospital
//==========================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;