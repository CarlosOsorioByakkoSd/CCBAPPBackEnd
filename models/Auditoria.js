const mongoose = require('mongoose');

const AuditoriasSchema = mongoose.Schema({
    ciclo: {
        type: String,
        require,
        trim: true
    },
    idpga:{
        type: String,
        require: true,
        trim: true,
    },
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    fechainicio:{
        type: String,
        require: true,
        trim: true
    },
    auditores: [{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Usuario'
    }],
    empresa:{
        type: String,
        require: true,
        trim: true
    },
    modalidad:{
        type: String,
        require: true,
        trim: true
    },
    tipoauditoria:{
        type: String,
        require: true,
        trim: true
    },
    estadoauditoria:{
        type: String,
        require: true,
        trim: true
    },
    objetivogeneral:{
        type: String,
        require: true,
        trim: true
    },
    mapaprocesos:{
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

module.exports = mongoose.model('Auditoria', AuditoriasSchema);