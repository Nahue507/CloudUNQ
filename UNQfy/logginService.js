var winston = require('winston');
var {Loggly} = require('winston-loggly-bulk');

winston.add(new Loggly({
    token:"", 
    subdomain:"" ,
    tags: ["Winston-NodeJS"],
    json: true
}));

function NotificarInfo(logg) {
    winston.log('info', logg);
}

function NotificarError(logg){
    winston.error(logg)
}

function NotificarWarning(logg){
    winston.warn(logg)
}
module.exports ={
    NotificarInfo,
    NotificarError,
    NotificarWarning
}