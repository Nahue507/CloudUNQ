let express = require('express')
let app = express()
let unqFy = require('./UnqyfyHelper')
let apiErrors = require("./ErrorsAPI")
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const InvalidJSON = apiErrors.InvalidJSON
const NotificadorMod = require('./NotificadorLog')
const Notificador = NotificadorMod.NotificadorLog
const notificador = new Notificador()
let bodyParser = require('body-parser')
let port = 8080;
let router = express.Router();

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);



router.get('/', function(req,res){
    res.json({message: 'Bienvenido a la API de UNQfy'});
});


//==================================================================================================================
//                                          ENDPOINTS DE ARTISTAS                                                  =
//================================================================================================================== 


router.post("/artists",(req,res,next) => {

    if (req.body.name && req.body.country ){
        if (!unqFy.containsArtist(req.body.name)){
            let artist = unqFy.addArtist(req.body)
            res.status(201)
            res.json({
                "id" : artist.id,
                "name" : artist.name,
                "albums" : artist.albums,
                "country" : artist.country})
                notificador.NotificarElementoAgregado(artist)
            }
        else {
            let error = new ElementAlreadyExistsError();
            notificador.NotificarError(error)
            next(error)
        }
    }
    else{
        next(new InvalidJSON())
    }
})


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
        let artist = unqFy.getArtistById(req.params.id)
        res.status(204) 
        notificador.NotificarElementoEliminado(artist)
        res.send("Artista Eliminado")

    }
    else{
        let error = (new ElementNotFound())
        notificador.NotificarError(error)
        next(error)
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
                let album = unqFy.getAlbumsByName(req.body.name)
                notificador.NotificarElementoAgregado(album) 
            }
            else{
                let error = new RelatedElementNotFound()
                notificador.NotificarError(error)
                next(error)
            }
        }
        else{
            let error = new ElementAlreadyExistsError()
            notificador.NotificarError(error)
            next(error)
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
            let album = unqFy.getAlbumById(req.params.id)
            notificador.NotificarElementoAgregado(album)
            
        }
        else{
            let error =new ElementNotFound()
            notificador.NotificarError(error)
            next(error)
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
        let album = unqFy.getAlbumById(req.params.id)
        notificador.NotificarElementoEliminado(album)
    }
    else{
        let error = new ElementNotFound()
        notificador.NotificarError(error)
        next(error)
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
        let error =new ElementNotFound()
        notificador.NotificarError(error)
        next(error)
    }
})



router.get("/isAlive",(req,res,next)=> {
    
        res.status(200)
        res.json("OK")
    
    
})

app.all("*",(req,res,next)=> {next(new ElementNotFound())})

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