const mongoose = require('mongoose');

const SeguimientoSchema = mongoose.Schema({
    observacion: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Observacion'
    },
    auditoria: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Auditoria'
    },
    rutaseguimiento:{
        type: String,
        require: true,
        trim: true
    },
    estadoseguimiento:{
        type: String,
        require: true,
        trim: true
    },
    conclusionseguimiento:{
        type: String,
        require: true,
        trim: true
    },
    fechainformeseguimiento:{
        type: String,
        require: true,
        trim: true
    },
    consecutivoinformeseguimiento:{
        type: String,
        require: true,
        trim: true
    },
    plananterior:{
        type: Array,
        require: true
    },
    creado:{
        type: Date,
        default: Date.now()
    },
    usuariocreo:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Seguimiento', SeguimientoSchema);