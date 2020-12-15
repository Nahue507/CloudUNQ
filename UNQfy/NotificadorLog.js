const LoggingConsumerMod = require('./consumerLog')
const LoggingConsumer = LoggingConsumerMod.LoggingConsumer
const NEWSLETTER_API_HOST = "http://172.20.0.10:8085";


class NotificadorLog {
    constructor() {
        this.suscriptores = [new LoggingConsumer()]
        
    }
    notificarElementoAgregado(elementoAgregado) {
        this.suscriptores.forEach(elem => elem.NotificarElementoAgregado(elementoAgregado))
    }

    notificarElementoEliminado(elementoEliminado){
        this.suscriptores.forEach(elem => elem.NotificarElementoEliminado(elementoEliminado))
    }

    notificarError(error){
        this.suscriptores.forEach(elem => elem.NotificarError(error))
    }

    suscribirse(suscriptor){
        this.suscriptores.push(suscriptor)
    }

    eliminarSuscripcion(suscriptor){
        this.suscriptores = this.suscriptores.filter(elem => elem == suscriptor)
    }
    //===========================================================================================
    //                                Newsletter
    //===========================================================================================
    notificarArtistaEliminado(artistToRemove){
     const data = { artistId: artistToRemove, };
    axios
    .delete(`${NEWSLETTER_API_HOST}/api/subscriptions`, data)
    .then(response => {
      
    })
    .catch(error => console.error(error));
    }
    notificarAlbumAgregado(nuevoArtista,nuevoAlbum){
    const data = {
            artistId: nuevoArtista.id,
            subject: `Nuevo Album para artsta, ${nuevoArtista.name}` ,
            message: `Se ha agregado el album ${nuevoAlbum.name} al artista ${nuevoArtista.name}`
          };
    
          axios
          .post(`${NEWSLETTER_API_HOST}/api/notify`, data)
          .then(response => {
            console.log("Notificación de nuevo álbum enviada")
          })
          .catch(error => console.error(error));
    }
}

module.exports ={
    NotificadorLog: NotificadorLog
}