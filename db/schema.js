const {gql} = require('apollo-server');

const typeDefs = gql`   
    
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        rol: Roles
        creado: String
    }

    type Token {
        token: String
    }

    type PlanGeneralAuditoria {
        id: ID
        ciclo: String
        actividades: [Actividad]
    }

    type Actividad {
        idpga: String
        trabajo: String
    }

    type Auditoria {
        id: ID
        ciclo: String
        idpga: String
        nombre: String
        fechainicio: String
        auditores: [Usuario]
        empresa: ListaEmpresa
        modalidad: ListaModalidad
        tipoauditoria: ListaTipoAuditoria
        estadoauditoria: EstadoAuditoria
        objetivogeneral: String
        mapaprocesos: [MapaProcesos]
        creado: String
        usuariocreo: ID
    }

    type MapaProcesos {
        macroproceso: String
        proceso: String
    }

    type Observacion {
        id: ID
        numero: Int
        auditoria: Auditoria
        tipoobservacion: TipoObservacion
        severidad: TipoSeveridad
        ldalre: String
        arearesponsable: String
        colaboradorresponsable: String
        parametrorequisito: String
        descripcionhechos: String
        impactoprobable: String
        recomendacion: String
        ruta: String
        estadoobservacion: EstadoObservacion
        planesdeaccion: [PlandeAccion]
        mapaprocesos: MapaProcesos
        usuariocreo: Usuario   
    }

    type PlandeAccion {
        causa: String
        actividadarealizar: String
        estadoactividad: EstadoActividad
        fechainicialactividad: String
        fechafinactividad: String
        responsable: String
        observaciones: String
        vigencia: Int
    }

    type Informe {
        id: ID
        consecutivo: String
        fechainforme: String
        tipoinforme: TipoInforme
        conclusiones: [Conclusion]
        destinatarios: [Destinatario]
        observaciones: [Observacion]
        auditoria: Auditoria
        creado: String
        usuariocreo: Usuario 
    }

    type Conclusion {
        descripcion: String
    }

    type Destinatario {
        nombre: String
        cargo: String
    }

    type Seguimiento {
        id: ID
        observacion: ID 
        auditoria: ID
        rutaseguimiento: String
        estadoseguimiento: EstadoSeguimiento
        conclusionseguimiento: String
        fechainformeseguimiento: String
        consecutivoinformeseguimiento: String
        plananterior: [PlandeAccion]
        creado: String
        usuariocreo: ID
    }

    type ReporteAbiertos {
        auditoria: ID
        ciclo: String
        idpga: String
        nombre: String
        macroproceso: String
        proceso: String
        empresa: String
        tipoauditoria: ListaTipoAuditoria
        consecutivo: String
        fechainforme: String
        numero: Int
        observacion: ID
        usuariocreoobservacion: String
        arearesponsable: String
        ldalre: String
        severidad: TipoSeveridad
        tipoobservacion: TipoObservacion
        estadoobservacion: EstadoObservacion
        descripcionhechos: String
        planesdeaccion: [PlandeAccion]
        fechafinplanaccion: String
        numeroseguimientos: Int
        estadoseguimiento: String
        fechaseguimiento: String
        conclusionseguimiento: String
        auditorseguimiento: String
    }


########################################
# INPUTS PARA REGISTRAR LA INFORMACIÓN #
########################################

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
        rol: Roles
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    input PlanGeneralAuditoriaInput {
        ciclo: String!
        actividades: [ActividadInput]
    }

    input ActividadInput {
        idpga: String
        trabajo: String
    }

    input AuditoriaInput {
        ciclo: String!
        idpga: String!
        nombre: String!
        fechainicio: String!
        auditores: [ID]!
        empresa: ListaEmpresa!
        modalidad: ListaModalidad!
        tipoauditoria: ListaTipoAuditoria!
        estadoauditoria: EstadoAuditoria!
        objetivogeneral: String!
        mapaprocesos: [MapaProcesosInput]
    }

    input MapaProcesosInput {
        macroproceso: String
        proceso: String
    }

    input ObservacionInput {
        auditoria: ID!
        tipoobservacion: TipoObservacion!
        severidad: TipoSeveridad!
        ldalre: String!
        arearesponsable: String!
        colaboradorresponsable: String!
        parametrorequisito: String!
        descripcionhechos: String!
        impactoprobable: String!
        recomendacion: String!
        ruta: String!
        estadoobservacion: EstadoObservacion!
        planesdeaccion: [PlandeAccionInput] 
        mapaprocesos: MapaProcesosInput
    }
   
    input PlandeAccionInput {
        causa: String
        actividadarealizar: String
        estadoactividad: EstadoActividad
        fechainicialactividad: String
        fechafinactividad: String
        responsable: String
        observaciones: String
    }

    input InformeInput {
        consecutivo: String!
        fechainforme: String!
        tipoinforme: TipoInforme!
        conclusiones: [ConclusionInput]
        destinatarios: [DestinatarioInput]
        observaciones: [ID]!
        auditoria: ID!
    }

    input ConclusionInput {
        descripcion: String
    }

    input DestinatarioInput {
        nombre: String
        cargo: String
    }

    input SeguimientoInput {
        observacion: ID! 
        auditoria: ID!
        rutaseguimiento: String!
        estadoseguimiento: EstadoSeguimiento!
        conclusionseguimiento: String!
        fechainformeseguimiento: String!
        consecutivoinformeseguimiento: String!
        plananterior: [PlandeAccionInput]
    }

    # Usar para ajustes masivos
    #input Ajustes {
    #    idObs:ID
    #    idUsu:ID
    #}
########################################
# ENUM PARA SELECCIONAR LA INFORMACIÓN #
########################################

    enum TipoSeveridad {
        BAJA
        MODERADA
        ALTA
    }

    enum EstadoActividad {
        EJECUTADA
        NO_EJECUTADA
    }

    enum Roles {
        ADMINISTRADOR
        AUDITOR
        JEFE_AUDITORIA
        CONTRALOR
    }

    enum TipoObservacion {
        HALLAZGO
        RECOMENDACION
        NO_CONFORMIDAD
        OPORTUNIDAD_DE_MEJORA
    }

    enum ListaEmpresa {
        CCB
        CERTICAMARA
        INVEST
        UNIEMPRESARIAL
        CORPARQUES
        CAEM
    }

    enum ListaModalidad {
        PROGRAMADAS_O_REGULARES
        EXCEPCION_O_CONSULTORIA
    }

    enum EstadoObservacion {
        ABIERTO
        CERRADO
    }

    enum ListaTipoAuditoria {
        SISTEMAS
        CUMPLIMIENTO
        SGC
        INTEGRAL
    }

    enum EstadoAuditoria {
        NO_INICIADO
        EN_PROCESO
        FINALIZADO
    }

    enum TipoInforme {
        AUDITORIA
        SEGUIMIENTO
    }

    enum EstadoSeguimiento {
        EFICAZ
        NO_EFICAZ
        EN_PROCESO
        IMPLEMENTADO
        NO_IMPLEMENTADO
        CERRADA_POR_PERDIDA_VIGENCIA
    }
########################################
# TYPES QUERY 
########################################

    type Query {
        # Usuarios
        obtenerUsuario: Usuario
        obtenerUsuariosNoAdmin: [Usuario]

        # PGA
         # Plan GEneral de Auditoria
        obtenerPlanGeneralAuditoria: [PlanGeneralAuditoria]
        obtenerPlanGeneralCiclo(ciclo: String!): PlanGeneralAuditoria

        # Auditorias
        obtenerAuditorias: [Auditoria]
        obtenerAuditoriasAuditor: [Auditoria]
        obtenerAuditoria(id: ID!): Auditoria

        # Observaciones
        obtenerObservacionesAuditoria(auditoria: ID!): [Observacion]

        # Informes de Auditoria
        obtenerInformesAuditoria: [Informe] 
        obtenerInformesAuditoriaObservaciones(informe: ID!): Informe

        #Seguimientos
        #obtenerSeguimientos(auditoria: ID!): [Seguimiento]

        # Reportes
        reporteEstadoObservaciones(estado: String): [ReporteAbiertos]
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input:UsuarioInput): Usuario
        autenticarUsuario(input:AutenticarInput): Token
        
        # Plan General de Auditoria
        nuevoPlanGeneralAuditoria(input: PlanGeneralAuditoriaInput): PlanGeneralAuditoria

        # Auditorias
        nuevaAuditoria(input:AuditoriaInput): Auditoria
        actualizarAuditoria(id:ID!, input:AuditoriaInput): Auditoria
        eliminarAuditoria(id:ID!) : String

        # Observaciones
        nuevaObservacion(input:ObservacionInput, auditor: ID) : Observacion

        # Informe de Auditoria
        nuevoInforme(input:InformeInput): Informe

        #Seguimiento
        nuevoSeguimiento(input:SeguimientoInput, inputObserv:ObservacionInput, auditor: ID): Seguimiento

        #Actualizar auditores observaciones - Usar para actualizar ajustes masivos
        #actualizarAuditoresObs(datos:[Ajustes]): Observacion
    }
`;

module.exports = typeDefs;