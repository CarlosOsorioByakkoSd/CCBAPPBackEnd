const mongoose = require('mongoose');
const autoIncrementarModelID = require('./Contador');

const ObservacionesSchema = mongoose.Schema({
    numero: {
        type: Number,
        unique: true,
        min: 1
    },
    auditoria: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Auditoria'
    },
    tipoobservacion:{
        type: String,
        require: true,
        trim: true
    },
    severidad:{
        type: String,
        require: true,
        trim: true
    },
    ldalre:{
        type: String,
        require: true,
        trim: true
    },
    arearesponsable:{
        type: String,
        require: true,
        trim: true
    },
    colaboradorresponsable:{
        type: String,
        require: true,
        trim: true
    },
    parametrorequisito:{
        type: String,
        require: true,
        trim: true
    },
    descripcionhechos:{
        type: String,
        require: true,
        trim: true
    },
    impactoprobable:{
        type: String,
        require: true,
        trim: true
    },
    recomendacion:{
        type: String,
        require: true,
        trim: true
    },
    ruta:{
        type: String,
        require: true,
        trim: true
    },
    estadoobservacion:{
        type: String,
        require: true,
        trim: true
    },
    planesdeaccion:{
        type: Array,
        require: true
    },
    mapaprocesos:{
        macroproceso:{
            type: String,
            require: true,
            trim: true
        },
        proceso:{
            type: String,
            require: true,
            trim: true
        }
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

ObservacionesSchema.pre('save', function (next) {
    if (!this.isNew) {
      next();
      return;
    }
  
    autoIncrementarModelID('observaciones', this , next);
  });
  

module.exports = mongoose.model('Observaciones', ObservacionesSchema);