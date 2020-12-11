let express = require('express')
let app = express()
let apiErrors = require("./ErrorsAPI")
const rp = require ('request-promise');
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const InvalidJSON = apiErrors.InvalidJSON
const email = require ("./EmailHandler")
const UNQFY_API_HOST = "http://172.20.0.20:8080";
let bodyParser = require('body-parser')
let port = 8085;
let router = express.Router();
const suscriptionMap = new Map();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/', router);



router.get('/api', function(req,res){
    res.json({message: 'Bienvenido a la API de UNQfy'});
});


function addSuscriber(artistID, email){

    if (suscriptionMap.has(artistID)){
        suscriptionMap.get(artistID).push(email)}
    else{suscriptionMap.set(artistID, [email])}

}

function deleteSuscriber(artistID, email){

    if (suscriptionMap.has(artistID)){
        suscriptionMap.get(artistID).splice(suscriptionMap.get(artistID).indexOf(email), 1);
    }
    
}

function artistExists(artistId){
    
    return rp.get(`${UNQFY_API_HOST}/api/artists/${artistId}`).then((res) => {
        return res.id === artistId;
    }).catch(error => {console.log(error.message)
    throw new apiErrors.RelatedElementNotFound})
}



//==================================================================================================================
//                                          ENDPOINTS DE SUSCRIPCIÖN                                               =
//================================================================================================================== 


router.post('/api/subscribe', function(req,res,next){

    if (req.body.artistId && req.body.email ){
        if (artistExists(req.body.artistId)) {
            
            addSuscriber(req.body.artistId, req.body.email)            
            res.status(200);
            res.json({message: `Emails agregados hasta la fecha ${suscriptionMap.get(req.body.artistId)}`});
                  
            }
        else {
            next(new ElementNotFound());
        }
    }
    else{
        next(new InvalidJSON())
    }
})


router.post("/api/unsubscribe",(req,res,next) => {

    if (req.body.artistId && req.body.email ){
        if (artistExists(req.body.artistId )) {
            
            
            deleteSuscriber(req.body.artistId, req.body.email)
            res.status(200);
            res.json({message: `Emails agregados hasta la fecha ${suscriptionMap.get(req.body.artistId)}`});
            
            
            }
        else {
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
})


router.post("/api/notify",(req,res,next) => {

    if (req.body.artistId && req.body.subject && req.body.message ){  
         
            res.status(200);
            
            console.log(req.body.subject)
            console.log(req.body.message)
            
            console.log("Botificación de nuevo álbum recibida")
            let mailer = new email.EmailHandler();
            mailer.sendEmails(req.body.artistId, req.body.subject, req.body.message)
            
             
    }
    else{
        next(new InvalidJSON())
    }
})


router.post("/api/subscriptions/:artistId",(req,res,next) =>  {
    if (artistExists(req.body.artistId )) {
        
        res.status(200);
        res.json({
            'artistId' : req.params.artistId,
            'subscriptors' : `${suscriptionMap.get(req.params.artistId)}`,
        })}   
        
    else { next(new ElementNotFound()) }
    }
   
)


router.get("/api/isAlive",(req,res,next) =>  {

            
        res.status(200);
        res.json({
            "Status" : "ok",            
        })   
           
})



router.delete("/api/subscriptions",(req,res,next) => {

    if (req.body.artistId ){
        if (artistExists(req.body.artistId )) {
            
            suscriptionMap.delete(req.body.artistId );
            res.status(200);
        }
            
        else { next(new ElementNotFound()) }
    }
    else{ next(new InvalidJSON())}
});



app.all("*",(req,res,next)=> {
    next(new ElementNotFound())
})

function errorHandler(err,req,res,next){
    console.log(err)
    if (apiErrors.Errores.some(elem => err instanceof elem)){
        res.status(err.status)
        res.json({
        status : err.status,
        errorCode : err.errorCode
        })
    }
    if (err instanceof SyntaxError){
        res.status(400)
        res.json({
            status: 400,
            errorCode : "BAD_REQUEST"
        })
    }
    else{
        next()
    }
    
}
app.use(errorHandler); 
app.listen(port);
console.log('Api Ready! ' + port);
