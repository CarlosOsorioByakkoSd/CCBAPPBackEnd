const mongoose = require('mongoose');

const InformesSchema = mongoose.Schema({
    consecutivo:{
        type: String,
        require: true,
        trim: true
    },
    fechainforme:{
        type: String,
        require: true,
        trim: true
    },
    tipoinforme: {
        type: String,
        require: true,
        trim: true
    },
    conclusiones: {
        type: Array,
        require: true
    },
    destinatarios: {
        type: Array,
        require: true
    },
    observaciones:[{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Observaciones'
    }],
    auditoria: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Auditoria'
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

module.exports = mongoose.model('Informe', InformesSchema);