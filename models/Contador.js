const mongoose = require('mongoose');

const ContadorSchema = mongoose.Schema({
    _id:{
        type: String,
        require: true,
        trim: true
    },
    seq:{
        type: Number,
        default: 0
    }
});

ContadorSchema.index({_id:1, seq: 1}, {unique: true});

const ContadorModel = mongoose.model('Contador', ContadorSchema);


const autoIncrementarModelID = function (modelName, doc, next) {
    ContadorModel.findByIdAndUpdate(        // ** Method call begins **
      modelName,                           // The ID to find for in counters model
      { $inc: { seq: 1 } },                // The update
      { new: true, upsert: true },         // The options
      function(error, contador) {           // The callback
        if(error) return next(error);
  
        doc.numero = contador.seq;    //.numero es el campo de la base de datos donde voy a almacenar el consecutivo
        next();
      }
    );                                     // ** Method call ends **
  }
  
  module.exports = autoIncrementarModelID;