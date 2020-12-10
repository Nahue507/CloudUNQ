let express = require('express')
let app = express()
let apiErrors = require("./ErrorsAPI")
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const InvalidJSON = apiErrors.InvalidJSON
let bodyParser = require('body-parser')
let port = 8085;
let router = express.Router();
const suscriptionMap = new Map();
const senderEmail = "j.giulianetti@gmail.com"

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

function sendMessage(userId, email, callback) {
    // Using the js-base64 library for encoding:
    // https://www.npmjs.com/package/js-base64
    var base64EncodedEmail = Base64.encodeURI(email);
    var request = gapi.client.gmail.users.messages.send({
      'userId': userId,
      'resource': {
        'raw': base64EncodedEmail
      }
    });
    request.execute(callback);
  }


//==================================================================================================================
//                                          ENDPOINTS DE SUSCRIPCIÖN                                               =
//================================================================================================================== 


router.post('/api/subscribe', function(req,res,next){

    if (req.body.artistId && req.body.email ){
        if (true) /*Artista existe*/{
            
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
        if (true) /*Artista existe*/{
            
            
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

    if (req.body.artistId && req.body.subject && req.body.message ){  /*Los argumentos están correctos*/
         
         	res.status(200);
            res.json({message: "Notificación de álbum agregado exitosa"});
            //sendMessage(senderEmail, suscriptionMap.get(req.body.artistId ), callback)
            
             
    }
    else{
        next(new InvalidJSON())
    }
})



router.get("/api/subscriptions:artistId",(req,res,next) =>  {
        //if (true) /*Artista existe*/{
            
            res.status(200);
            res.json({
                'artistId' : req.params.artistId,
                'subscriptors' : `${suscriptionMap.get(req.params.artistId)}`,
            })//}   
            
        //else { next(new ElementNotFound()) }
    }
   
)


router.delete("/api/subscriptions",(req,res,next) => {

    if (req.body.artistId ){
        if (true) /*Artista existe*/{
            
            res.json({message: ""});
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
