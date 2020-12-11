const LoggingConsumerMod = require('../Logger/consumerLog')
const LoggingConsumer = LoggingConsumerMod.LoggingConsumer


class NotificadorLog {
    constructor() {
        this.suscriptores = [new LoggingConsumer()]
        
    }
    NotificarElementoAgregado(elementoAgregado) {
        this.suscriptores.forEach(elem => elem.NotificarElementoAgregado(elementoAgregado))
    }

    NotificarElementoEliminado(elementoEliminado){
        this.suscriptores.forEach(elem => elem.NotificarElementoEliminado(elementoEliminado))
    }

    NotificarError(error){
        this.suscriptores.forEach(elem => elem.NotificarError(error))
    }

    Suscribirse(suscriptor){
        this.suscriptores.push(suscriptor)
    }

    EliminarSuscripcion(suscriptor){
        this.suscriptores = this.suscriptores.filter(elem => elem == suscriptor)
    }
}

module.exports ={
    NotificadorLog: NotificadorLog
}