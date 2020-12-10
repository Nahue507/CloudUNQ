

const express = require('express')
const app = express();
const MonitorMessage = require('./monitormessage');
const ServicesMonitor = require('./ServicesMonitor');

const apiErrors = require("./ErrorsAPI");

const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const router = express.Router();
const rp = require('request-promise');


//ENDPOINTS A VERIFICAR
//CREO que son los ends correctos
const unqfyURL = 'http://localhost:5001/api/status';
const loggingURL = 'http://localhost:5003/logging/status';
const notificationURL = 'http://localhost:5002/api/status';

//HEADER PARA LOS ENDPOINT
const options = function(_url) {
    return {url: _url,
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
    },
    json: true,
    }
}

const notificarViaDiscord = function(service) { //notifico por Discord
    const url = 'https://discord.com/api/webhooks/783468497522262017/wUugIlByGRm7blxJbw044et07Jvx7Md18UP2VDCar3BIMUGWdAddNy7-iZhlfY3Aoblk';
    var payload = {"text": new MonitorMessage.MonitorMessage(service).Notify()}
    payload = JSON.stringify(payload);

    rp.post({url: url, body: payload})
    .then(resp => {
        console.log("Enviada notificacion al canal de Discord");
    })
    .catch(error => {
        console.log(error.message);
    })      
}

//instancio las clases para que sean monitoreables
const unqfy = new ServicesMonitor.ServicesMonitor("UNQfy",options(unqfyURL),notificarViaDiscord);
const logging = new ServicesMonitor.ServicesMonitor("Logging",options(loggingURL),notificarViaDiscord);
const notification = new ServicesMonitor.ServicesMonitor("Notification",options(notificationURL),notificarViaDiscord);

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/monitor', router);
//Activa o desactiva el monitor
let verificacionActivada = true;

router.get("/status", (req,res,next) => { //endpoint para activar o desactivar el monitor
    res.status(200);
    verificacionActivada = !verificacionActivada;
    res.json("Servicio " + ((verificacionActivada) ? "Activado" : "Desactivado"))
})



const checkAllStatus = function(){ // Si esta activado el monitor, checkea si cambio el estado
    if (verificacionActivada){
        unqfy.checkStatus();
        logging.checkStatus();
        notification.checkStatus();
    }
}




app.listen(port);
console.log('Api Ready! ' + port);
setInterval(checkAllStatus, 5000);
