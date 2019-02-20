var express = require('express');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// Importar Schema de hospital
var Medico = require('../models/medico');

//==========================================
// Obtener todos los médicos
//==========================================
app.get('/', (req, res, nex) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar médicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            }
        );
});

//==========================================
// Actualizar médico
//==========================================
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar médico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico con id ' + id + ' no existe',
                errors: { message: 'No existe un médico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.idh

        medico.save((err, medicoActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar médico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoActualizado
            });
        });
    });
});

//==========================================
// Crear un nuevo médico
//==========================================
app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body; // Extrae el contenido del body
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario,
        hospital: body.idh
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al registrar médico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.usuario
        });
    });
});

//==========================================
// Eliminar médico
//==========================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar médico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Médico no existe',
                errors: { message: 'No existe un médico con ese ID' }
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;