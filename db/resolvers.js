//Importamos los modelos
const Usuario = require('../models/Usuario');
const Auditoria = require('../models/Auditoria');
const Observacion = require('../models/Observacion');
const PlanGeneralAuditoria = require('../models/PlanGeneralAuditoria');
const Informe = require('../models/Informe');
const Seguimiento = require('../models/Seguimiento');
const moment = require('moment');

//Importar libreria para hashear el password
const bcryptjs = require('bcryptjs');
require('dotenv').config({path: 'variables.env'});

//Importar libreria del JWT
const jwt = require('jsonwebtoken');


//crear Token
const crearToken = (usuario, secreta, expiresIn) => {
    //console.log(usuario);
    //cabecera que se le va a agregar al JWT
    const {id, email, nombre, apellido} = usuario
    //sign para firmar un nuevo JWT
    //1. Payload (información que se guarda en el token)
    //2. Palabra secreta
    //3. Expiración
    return jwt.sign({id, email, nombre, apellido}, secreta,{expiresIn})
}

/* usar para realizar ajustes masivos
const mostrar = async (dato) => {
    //console.log(dato)
    let observacion = await Observacion.findById(dato.idObs)
    if(!observacion){
        throw new Error ('Observación no encontrada')
    }
    observacion = await Observacion.findOneAndUpdate({_id:dato.idObs},{usuariocreo:dato.idUsu},{new:true})
    return observacion
}*/

const resolvers = {
    Query: {
        obtenerUsuario: async (_,{}, ctx) => {
           return ctx.usuario;
        },
        obtenerUsuariosNoAdmin: async () => {
            try {
                const usuarios = await Usuario.find({rol: ['AUDITOR']});
                return usuarios;
            } catch (error) {
                console.log(error)
            }
        },
        obtenerPlanGeneralAuditoria: async () => {
            try {
                const plangeneral =  await PlanGeneralAuditoria.find({});
                return plangeneral
            } catch (error) {
                throw new Error ('Este ciclo no tiene ID')
            }
        },
        obtenerPlanGeneralCiclo: async (_,{ciclo}) => {
            try {
                const plangeneral = await PlanGeneralAuditoria.findOne({ ciclo: ciclo.toString()});
                return plangeneral;
            } catch (error) {
                console.log(error)
            }
        },
        obtenerAuditorias: async () => {
            try {
                const auditoria = await Auditoria.find({});
                return auditoria;
            } catch (error) {
                console.log(error)
            }
        },
        obtenerAuditoriasAuditor: async (_,{},ctx) => {
            try {
                const auditoria = await Auditoria.find({ usuariocreo: ctx.usuario.id.toString()});
                return auditoria;
            } catch (error) {
                console.log(error)
            }
        },
        obtenerAuditoria: async (_,{id},ctx) => {
            //revisar si existe la auditoria
            const auditoria = await Auditoria.findById(id);
            if(!auditoria){
                throw new Error ('Auditoria no encontrada')
            }
            //Quien lo creo puede verlo
            if(auditoria.auditor.toString() !== ctx.usuario.id) {
                throw new Error ('No tienes las creedenciales para ver la auditoria')
            }
            return auditoria;
        },
        obtenerInformesAuditoria: async (_,{}, ctx) => {
            try {
                const populate = {path: 'auditoria', select: 'ciclo idpga nombre fechainicio usuariocreo'}
                const informes = await Informe.find().populate(populate)
                const informeauditor = informes.filter(informe => informe.auditoria.usuariocreo.toString() === ctx.usuario.id)
                return informeauditor
            } catch (error) {
                console.log(error)
            }
        },
        obtenerInformesAuditoriaObservaciones: async (_, {informe}) => {
            try {
                const populateAudi = {path: 'auditoria', select: 'id'}
                const informes = await Informe.findById(informe).populate('observaciones')
                return informes;
            } catch (error) {
                console.log(error)
            }
        },
        obtenerObservacionesAuditoria: async (_,{auditoria}) => {
            try {
                const populate = {path: 'usuariocreo', select: 'nombre apellido rol'}
                const populateAudi = {path: 'auditoria', select: 'id'}
                const observacion = await Observacion.find({ auditoria: auditoria}).populate(populate).populate(populateAudi)
                return observacion;
            } catch (error) {
                console.log(error)
            }
        },
        reporteEstadoObservaciones: async (_,{estado}) => {
            let reporteEstadoObservaciones = []
            let populateObserv = ''
            if(estado==="") {
                populateObserv = {path: 'observaciones', 
                                        select: 'id numero severidad ldalre tipoobservacion descripcionhechos estadoobservacion planesdeaccion arearesponsable mapaprocesos'}
            } else {
                populateObserv = {path: 'observaciones', 
                                    select: 'id numero severidad ldalre tipoobservacion descripcionhechos estadoobservacion planesdeaccion arearesponsable mapaprocesos', 
                                    match: { estadoobservacion: estado }}
            }
            const populateAudito = {path: 'auditoria', select: 'id ciclo idpga nombre tipoauditoria macroproceso proceso empresa'}
            /*const populateObserv = {path: 'observaciones', 
                                    select: 'id numero severidad tipoobservacion descripcionhechos estadoobservacion planesdeaccion', 
                                    match: { estadoobservacion: estado }
                                    }*/
            try {
                //Consultamos los informes de auditoria y traemos la información de observaciones
                const informe = await Informe.find().populate(populateAudito).populate(populateObserv)
                informe.map((inf) => {
                    inf.observaciones.map((obs) => {
                        reporteEstadoObservaciones.push({
                            auditoria: inf.auditoria.id,
                            ciclo: inf.auditoria.ciclo,
                            idpga: inf.auditoria.idpga,
                            nombre: inf.auditoria.nombre,
                            macroproceso: obs.mapaprocesos.macroproceso,
                            proceso: obs.mapaprocesos.proceso,
                            empresa: inf.auditoria.empresa,
                            tipoauditoria: inf.auditoria.tipoauditoria,
                            consecutivo: inf.consecutivo,
                            fechainforme: inf.fechainforme,
                            numero: obs.numero,
                            arearesponsable: obs.arearesponsable,
                            usuariocreoobservacion:'',
                            observacion: obs.id,
                            severidad: obs.severidad,
                            ldalre: obs.ldalre,
                            tipoobservacion: obs.tipoobservacion,
                            estadoobservacion: obs.estadoobservacion,
                            descripcionhechos: obs.descripcionhechos,
                            planesdeaccion: obs.planesdeaccion,
                            fechafinplanaccion: '',
                            numeroseguimientos: 0,
                            estadoseguimiento: '',
                            fechaseguimiento: '',
                            conclusionseguimiento: '',
                            auditorseguimiento: ''
                        })
                    })
                })

                //Consultamos las observaciones para traer el auditor que la creo
                reporteEstadoObservaciones.map(async (rep) => {
                    const populate = {path: 'usuariocreo', select: 'nombre apellido'}
                    const observacion = await Observacion.findOne({ _id:rep.observacion.toString()}).populate(populate)
                    rep.usuariocreoobservacion = observacion.usuariocreo.nombre + ' ' + observacion.usuariocreo.apellido 
                })

                //Consultamos los seguimientos y traemos la información de los seguimientos por auditoria y observación
                const populateSegui = {path: 'usuariocreo', select: 'nombre apellido'}
                const seguimientos = await Seguimiento.find().populate(populateSegui)
                reporteEstadoObservaciones.map((rep) => {
                    let cantidadSeguimientos = 0
                    seguimientos.map((seg) => {  
                        if(rep.auditoria === seg.auditoria.toString() && rep.observacion === seg.observacion.toString()) {
                            cantidadSeguimientos = cantidadSeguimientos + 1
                            rep.numeroseguimientos = cantidadSeguimientos
                            rep.estadoseguimiento = seg.estadoseguimiento
                            rep.fechaseguimiento = moment(new Date(seg.creado)).format('YYYY/MM/DD')
                            rep.conclusionseguimiento = seg.conclusionseguimiento
                            rep.auditorseguimiento = seg.usuariocreo.nombre + ' ' + seg.usuariocreo.apellido
                        } 
                    })
                })
                //Calculamos la diferencia en dias de los planes de acción
                let ahora = moment(new Date(), 'YYYY/MM/DD');
                reporteEstadoObservaciones.map((rep) => {
                    //variable para calcular fecha fin del plan de acción
                    let fechaFinPlan = moment(new Date(rep.planesdeaccion[0].fechafinactividad), 'YYYY/MM/DD')
                    //recorremos plan de acción para calcular vigencia de cada actividad
                    rep.planesdeaccion.map((plan) => {
                        let fechafin = moment(plan.fechafinactividad, 'YYYY/MM/DD');
                        //calculamos por cada actividad la mayor fecha
                        if(fechafin > fechaFinPlan) {
                            fechaFinPlan = fechafin
                        }
                        if(fechafin < ahora && plan.estadoactividad === "NO_EJECUTADA") {
                            let duracion = moment.duration(ahora.diff(fechafin))
                            let dias = duracion.asDays()
                            plan.vigencia = Math.round(dias)
                            /*rep.vigencia.push({
                                actividad: plan.actividadarealizar,
                                dias: dias
                            })*/
                        }
                        
                    })
                    //colocamos la fecha fin del plan para cada observación
                    rep.fechafinplanaccion = moment(new Date(fechaFinPlan)).format('YYYY/MM/DD')
                })
                return reporteEstadoObservaciones;
            } catch (error) {
                console.log(error)
            }
        },
    },
    Mutation: {
        nuevoUsuario: async (_,{input}) => {
            const{email, password} = input;
            //validar si esta registrado el usuario
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado')
            }
            //hashear su password
            const salt = await bcryptjs.genSalt(10);
            input.password  = await bcryptjs.hash(password,salt);

            try {
                //guardar usuario en la BD
                const usuario = new Usuario(input);
                usuario.save();
                return usuario;
            } catch (error) {
                console.log(error)
            }
        },
        autenticarUsuario: async (_,{input}) => {
            const {email, password} = input;
            //validar si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if (!existeUsuario) {
                throw new Error('El usuario no existe')
            }

            // validar si el password es correcto, el que ingresa con el de la base de datos
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if(!passwordCorrecto) {
                throw new Error ('El password es Incorrecto')
            }
            // Llamamos función para Crear el token
            //1. que información se va a almacenar en el JWT
            //2. Palabra Secreta
            //3. Tiempo de Expiración de la sesión para volver a iniciar sesión 
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        },
        nuevoPlanGeneralAuditoria: async (_,{input}) => {
            const nuevoPga = new PlanGeneralAuditoria(input);
            try {
                const resultado = await nuevoPga.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        nuevaAuditoria: async (_, {input}, ctx) => {
            const creandoAuditoria = new Auditoria(input);
            creandoAuditoria.usuariocreo = ctx.usuario.id
            try {
                //almacenar en la bd
                const resultado = await creandoAuditoria.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }

        },
        actualizarAuditoria: async (_,{id, input},ctx) => {
            //revisar si existe la auditoria
            let auditoria = await Auditoria.findById(id);
            if(!auditoria){
                throw new Error ('Auditoria no encontrada')
            }
            // verificar si el auditor es quíen edita
             //Quien lo creo puede verlo
             if(auditoria.auditor.toString() !== ctx.usuario.id) {
                throw new Error ('No tienes las creedenciales para ver la auditoria')
            }
            //guardar en la base de datos
            //1. Id a buscar
            //2. Input con la nueva información

            auditoria = await Auditoria.findOneAndUpdate({_id:id},input,{new:true});
            return auditoria
        },
        /* usar para realizar ajustes masivos
        actualizarAuditoresObs: async (_,{datos}) => {
            const recorre = datos.map((dato) => {
                mostrar(dato)
            })
        },*/
        eliminarAuditoria: async (_,{id}) => {
            //revisar si existe la auditoria
            let auditoria = await Auditoria.findById(id);
            if(!auditoria){
                throw new Error ('Auditoria no encontrada')
            }
            //Eliminar
            await Auditoria.findOneAndDelete({_id:id});
            return "Auditoria Eliminado";
        },
        nuevaObservacion: async (_,{input, auditor}) => {
            const creandoObservacion = new Observacion(input);
            //creandoObservacion.usuariocreo = ctx.usuario.id
            creandoObservacion.usuariocreo = auditor
            try {
                //almacenar en la bd
                const resultado = await creandoObservacion.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        nuevoInforme: async (_,{input},ctx) => {
            const nuevaInforme = new Informe(input);
            nuevaInforme.usuariocreo = ctx.usuario.id
            try {
                const resultado = await nuevaInforme.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        nuevoSeguimiento: async (_,{input, inputObserv, auditor}) => {
            if(input.estadoseguimiento === "EFICAZ" || input.estadoseguimiento ==="IMPLEMENTADO" || input.estadoseguimiento === "NO_IMPLEMENTADO" || input.estadoseguimiento === "CERRADA_POR_PERDIDA_VIGENCIA") {
                inputObserv.estadoobservacion = "CERRADO"
            } else if (input.estadoseguimiento === "EN_PROCESO" || input.estadoseguimiento === "NO_EFICAZ") {
                inputObserv.estadoobservacion = "ABIERTO"
            }
            
            //busar observacion a editar
            let observacion = await Observacion.findById(input.observacion);
            const creandoSeguimiento = new Seguimiento(input);
            //creandoSeguimiento.usuariocreo = ctx.usuario.id
            creandoSeguimiento.usuariocreo = auditor
            try {
                //almacenar en la bd
                const resultado = await creandoSeguimiento.save();
                //editar observacion
                observacion = await Observacion.findOneAndUpdate({_id:input.observacion},inputObserv,{new:true});
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
    }
}

module.exports = resolvers;