const express = require('express')
const app = express();
const apiErrors = require("./ErrorsAPI");
const bodyParser = require('body-parser');
const port = 8081;
const router = express.Router();
const rp = require('request-promise');

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/monitor', router);

let monitoreoActivo = true;


//const notificarViaDiscord = function(service) { 
//    const url = 'https://discord.com/api/webhooks/783468497522262017/wUugIlByGRm7blxJbw044et07Jvx7Md18UP2VDCar3BIMUGWdAddNy7-iZhlfY3Aoblk';
//    var payload = {"text": new MonitorMessage.MonitorMessage(service).Notify()}
//    payload = JSON.stringify(payload);
//
//    rp.post({uri:url, body: {"content": payload}})
//    .then(resp => {
//        console.log("Enviada notificacion al canal de Discord");
//    })
//    .catch(error => {
//        console.log(error.message);
//    })      
//}


router.get("/activate", (req,res,next) => { 
    res.status(200);
    monitoreoActivo = !monitoreoActivo;
    res.json("Monitoreo " + ((monitoreoActivo) ? "Activado" : "Desactivado"))
})



function poll(serviceName,url) {
    
    rp.get(url).then( resp => {
        if (res.status ===200){
            console.log("El servidor "+ serviceName + " está activo");
        }
    })
    .catch( error => {
        console.log("No se pudo alcanzar la url de "+ serviceName );
        //Notificar
    })
   
}

const checkAllStatus = function(){
    if (monitoreoActivo){

        poll("UNQfy", 'http://172.20.0.20:8080/api/isAlive');
        //poll("Logger", 'http://localhost:5003/api/isAlive');
        poll("Newsletter", 'http://172.20.0.10:8085/api/isAlive');
    }
}

app.listen(port);
console.log('Api Ready! ' + port);
setInterval(checkAllStatus, 5000);
