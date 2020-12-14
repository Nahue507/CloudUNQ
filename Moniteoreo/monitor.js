const express = require('express')
const app = express();
const apiErrors = require("./ErrorsAPI");
const axios = require('axios');
const bodyParser = require('body-parser');
const port = 8081;
const router = express.Router();
const rp = require('request-promise');
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/monitor', router);
//End points
const urlDiscord = "https://discord.com/api/webhooks/783468497522262017/wUugIlByGRm7blxJbw044et07Jvx7Md18UP2VDCar3BIMUGWdAddNy7-iZhlfY3Aoblk";
const unqFyVivo= 'http://172.20.0.20:8080/api/isAlive';
const loggerVivo='http://172.20.0.30:8083/logging/isAlive';
const newsletterVivo='http://172.20.0.10:8085/api/isAlive';

let monitoreoActivo = true;

let currentunqNotification = {value:true};
let currentloggerNotification = {value:true};
let currentnewsletterNotification = {value:true};

let priorunqNotification = {value:null};
let priorloggerNotification = {value:null};
let priornewsletterNotification = {value:null};

function statusChanger(varObj, newValue) { 
    
    varObj.value = newValue; 
    
  } 

function incidentTime(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}




const notificarPorDiscord = function(service, status) {    
      axios
      .post(urlDiscord, {
        "content": `[${incidentTime()}] ${service} ${status}`})
      .then(res => {
        console.log("Notificación enviada a discord")
      })
      .catch(error => console.error(error));   
}

router.get("/status", (req,res,next) => { 
    res.status(200);
    poll("UNQfy",unqFyVivo , currentunqNotification, priorunqNotification);
    poll("Logger", loggerVivo, currentloggerNotification, priorloggerNotification);
    poll("Newsletter",newsletterVivo , currentnewsletterNotification, priornewsletterNotification);
})


router.get("/activate", (req,res,next) => { 
    res.status(200);
    monitoreoActivo = !monitoreoActivo;
    console.log("Monitoreo " + ((monitoreoActivo) ? "Activado" : "Desactivado"));
    res.json("Monitoreo " + ((monitoreoActivo) ? "Activado" : "Desactivado"));
})

function poll(serviceName, url, currentNotification, priorNotification) {
    
    

    axios.get(url).then(res => {
                
        
        if (res.status ==200){
            
            statusChanger(currentNotification, true)
            
            if ( !(currentNotification.value===priorNotification.value) ){
                notificarPorDiscord(serviceName, "está activo");
                console.log(serviceName, "está activo" );
                statusChanger(priorNotification, currentNotification.value);
                statusChanger(currentNotification, true);
            }
        }
    }).catch( error => {

        statusChanger(currentNotification, false)
        if ( !(currentNotification.value===priorNotification.value) ){
            
            notificarPorDiscord(serviceName, "está inactivo");
            console.log(serviceName, "está inactivo" );
            statusChanger(priorNotification, currentNotification.value);
            statusChanger(currentNotification, false);
        }
    })
}

const checkAllStatus = function(){
    //Strings Ojo.
    while(monitoreoActivo){
        console.log("Polling")
        
        poll("UNQfy", unqFyVivo, currentunqNotification, priorunqNotification);
        poll("Logger", loggerVivo, currentloggerNotification, priorloggerNotification);
        poll("Newsletter", newsletterVivo, currentnewsletterNotification, priornewsletterNotification);
    }
}

app.listen(port);
console.log('Api Ready! ' + port);

setInterval(checkAllStatus, 5000);
