let express = require('express')
let app = express()
let unqFy = require('./UnqyfyHelper')
let apiErrors = require("./ErrorsAPI")
const ElementAlreadyExistsError = apiErrors.ElementAlreadyExistsError
const ElementNotFound = apiErrors.ElementNotFound
const RelatedElementNotFound = apiErrors.RelatedElementNotFound
const InvalidJSON = apiErrors.InvalidJSON
let bodyParser = require('body-parser')
let port = process.env.PORT || 8080;
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
            }
        else {
            next(new ElementAlreadyExistsError())
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

router.patch("/artists/:id",(req,res,next) => {
    if (req.body.name && req.body.country ){
        if (unqFy.containsIdArtist(req.params.id)){
            res.status(200) 
            res.json(unqFy.updateArtist(req.params.id,req.body))
        }
        else{
            next(new ElementNotFound())
        }
    }
    else{
        next(new InvalidJSON())
    }
})

router.delete("/artists/:id",(req,res,next) => {res.status(204)
    if (unqFy.containsIdArtist(req.params.id)){
        unqFy.RemoveArtist(req.params.id)
    res.send("Artista Eliminado")
    }
    else{
        next(new ElementNotFound())
    }
})

router.get("/artists",(req,res) =>{
    if (req.query.name != undefined){
    res.status(200)
    res.json(unqFy.getArtistsByName(req.query.name))
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
            res.json(unqFy.UpdateAlbum(req.params.id,req.body))
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
        unqFy.RemoveAlbum(req.params.id)
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