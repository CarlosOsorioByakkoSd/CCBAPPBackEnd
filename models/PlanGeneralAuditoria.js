const mongoose = require('mongoose');

const PlanGeneralAuditoriaSchema = mongoose.Schema({
    ciclo:{
        type: String,
        require: true,
        trim: true
    },
    actividades:{
        type: Array,
        require: true
    }
});

module.exports = mongoose.model('PlanGeneralAuditoria', PlanGeneralAuditoriaSchema);   