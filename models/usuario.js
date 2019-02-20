var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, require: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, require: [true, 'El email es obligatorio'] },
    password: { type: String, require: [true, 'La contraseña es obligatoria'] },
    img: { type: String, require: false },
    role: { type: String, require: true, default: 'USER_ROLE', enum: rolesValidos }
}, { collection: 'usuarios' });

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya se encuentra registrado' });

module.exports = mongoose.model('Usuario', usuarioSchema);