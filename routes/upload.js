var express = require('express');
var fileUpload = require('express-fileupload');
// Librería de file system: permite borrar archivos del servidor
var fs = require('fs');
var app = express();

// Importación de mmodelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Opciones por defecto
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, nex) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['usuarios', 'medicos', 'hospitales']

    // Validar que la colección enviada se encuentre en el arreglo
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Colección no válida',
            errors: { massege: 'Las colecciones válidas son: ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { massege: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    // Validar que la extensión del archivo subido se encuentre en el arreglo
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { massege: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // ejemplo muestra: 1234567-123.png
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un PATH especifico
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipos(tipo, id, nombreArchivo, res);

    });

});

function subirPorTipos(tipo, id, nombreArchivo, res) {
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {
                var pathViejo = './uploads/usuarios/' + usuario.img;

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario',
                        errors: err
                    });
                }
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El usuario con id ' + id + ' no existe',
                        errors: { message: 'No existe un usuario con ese ID' }
                    });
                }
                //Consultamos si existe el archivo de img en el servidor, se debe eliminar
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                    // fs.unlink(pathViejo, (err => {
                    //     console.log('borrado');
                    // }));
                }

                usuario.img = nombreArchivo;

                usuario.save((err, usuarioActualizado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar usuario',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    });
                });
            });
            break;
        case 'medicos':
            Medico.findById(id, (err, medico) => {
                var pathViejo = './uploads/medicos/' + medico.img;

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
                //Consultamos si existe el archivo de img en el servidor, se debe eliminar
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                medico.img = nombreArchivo;

                medico.save((err, medicoActualizado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar médico',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de médico actualizada',
                        medico: medicoActualizado
                    });
                });
            });
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                var pathViejo = './uploads/hospitales/' + hospital.img;

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
                //Consultamos si existe el archivo de img en el servidor, se debe eliminar
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                hospital.img = nombreArchivo;

                hospital.save((err, hospitalActualizado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar hospital',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    });
                });
            });
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de colecciones solo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }
}


module.exports = app;