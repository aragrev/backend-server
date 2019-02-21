var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');


app.get('/:tipo/:img', (req, res, nex) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    // Verificar que la imagen existe en el directorio
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen); // en desuso "sendfile"
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

})

module.exports = app;