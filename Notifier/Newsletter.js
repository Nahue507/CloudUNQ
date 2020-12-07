let express = require('express')
let app = express()
let apiErrors = require("./ErrorsAPI")
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const InvalidJSON = apiErrors.InvalidJSON
let bodyParser = require('body-parser')
let port = process.env.PORT || 8080;
let router = express.Router();
const suscriptionMap = new Map();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/', router);



router.get('/api', function(req,res){
    res.json({message: 'Bienvenido a la API de UNQfy'});
});


function addSuscriber(artistID, email){

}


//==================================================================================================================
//                                          ENDPOINTS DE SUSCRIPCIÖN                                               =
//================================================================================================================== 


router.post('/api/subscribe', function(req,res,next){

    if (req.body.artistId && req.body.email ){
        if (true) /*Artista existe*/{
            
            res.status(200);
            suscriptionMap.set(req.body.artistId, req.body.email)
            res.json({message: `Suscripción exitosa de ${req.body.email}`});
                  
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
            
            /*Quitar el mail de la lista de suscripción del artista*/
            res.status(200);
            res.json({message: "Desuscripción exitosa"});
            
            
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
            /*enviar mail a los interesados en el artista*/
            
             
    }
    else{
        next(new InvalidJSON())
    }
})



router.get("/api/subscriptions:artistId",(req,res,next) => {

    if (req.body.artistId ){
        if (true) /*Artista existe*/{
            

            res.json({message: `Búsqueda de ${req.body.artistId}`});
            res.status(200);
            res.json({
                "artistId" : req.body.artistId,
                "subscriptors" : suscriptionMap.get(req.body.artistId),
            })}   
            
        else { next(new ElementNotFound()) }
    }
    else{ next(new InvalidJSON())}
})


router.delete("/api/subscriptions",(req,res,next) => {

    if (req.body.artistId ){
        if (true) /*Artista existe*/{
            
            res.json({message: "Desuscripción exitosa"});
            suscriptionMap.delete(req.body.artistId);
            res.status(200);
        }
            
        else { next(new ElementNotFound()) }
    }
    else{ next(new InvalidJSON())}
});














/*
router.get("/artists/:id",(req,res,next) => {
    if (unqFy.containsIdArtist(req.params.id)){
        res.status(200)
        res.json(unqFy.getArtistById(req.params.id))
    }
    else{
        next(new ElementNotFound())
    }})

router.put("/artists/:id",(req,res,next) => {
    if (req.body.name && req.body.country ){
        if (unqFy.containsIdArtist(req.params.id)){
            res.status(200) 
            updatedArtist = unqFy.updateArtist(req.params.id,req.body)
            res.json(updatedArtist)
        }
        else{
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
})

router.delete("/artists/:id",(req,res,next) => {
        
    if (unqFy.containsIdArtist(req.params.id)){
        unqFy.removeArtist(req.params.id)
        res.status(204) 
        res.send("Artista Eliminado")
    }
    else{
        next(new ElementNotFound())
    }
})

router.get("/artists",(req,res) =>{
    if (req.query.name != undefined){
    res.status(200)
    artist = unqFy.getArtistsByName(req.query.name);
    
    res.json(artist)
    }
    else{
        res.status(200)
        res.json(unqFy.getArtistsByName(""))
    }

})

//==================================================================================================================
//                                          ENDPOINTS DE ÁLBUMES                                                   =
//================================================================================================================== 


router.post("/albums",(req,res,next) => {
    if (req.body.name && req.body.year && req.body.artistId !== undefined){
        
        if (!unqFy.containsAlbumByName(req.body.name)){
            if(unqFy.containsIdArtist(req.body.artistId)){
                res.status(201)
                res.json(unqFy.addAlbum(req.body))
            }
            else{
                next(new RelatedElementNotFound())
            }
        }
        else{
            next(new ElementAlreadyExistsError())
        }
    }
    else{
        next(new InvalidJSON())
    }

})

router.get("/albums/:id",(req,res,next) => {
    if (unqFy.containsidAlbum(req.params.id)){
        res.status(200)
        res.json(unqFy.getAlbumById(req.params.id))
    }
    else{
        next(new ElementNotFound())
    }
})


router.patch("/albums/:id",(req,res,next) => {
    if (req.body.name || req.body.year ){
        if (unqFy.containsidAlbum(req.params.id)){
            res.status(200)
            res.json(unqFy.updateAlbum(req.params.id,req.body))
        }
        else{
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
 
})

router.delete("/albums/:id",(req,res,next) => {
    if (unqFy.containsidAlbum(req.params.id)){
        res.status(204)
        unqFy.removeAlbum(req.params.id)
        res.send("Album Eliminado")
    }
    else{
        next(new ElementNotFound())
    }
})

router.get("/albums",(req,res) => {
    if (req.query.name != undefined){
        res.status(200)
        res.json(unqFy.getAlbumsByName(req.query.name))
    }
    else{
        res.status(200)
        res.json(unqFy.getAlbumsByName(""))
    }
})

//==================================================================================================================
//                                          ENDPOINTS DE TRACKS                                                    =
//================================================================================================================== 


router.get("/tracks/:id/lyrics",(req,res,next)=> {
    if (unqFy.containsIdTrack(req.params.id)){
        res.status(200)
        let lyrics = unqFy.getLyrics(req.params.id)
        res.json(lyrics)
    }
    else{
        next(new ElementNotFound())
    }
})

*/

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
