var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, require: [true, 'El nombre es obligatorio'] },
    img: { type: String, require: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id del hospital es un campo obligatorio'] }
}, { collection: 'medicos' });

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya se encuentra registrado' });

module.exports = mongoose.model('Medico', medicoSchema);