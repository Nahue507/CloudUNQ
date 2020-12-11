const express = require('express')
const loggly = require('./logService')
const apiErrors = require("./ErrorsAPI")
const ServerOFFError = apiErrors.ServerOFFError
const app = express()
const bodyParser = require('body-parser')
const port = 8083;
const router = express.Router();
const fs = require('fs');
const filename = 'loggs.json'
var status = "ON"
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())


app.post('/logging/status',(req,res,next) => {
    status = req.body.status
    res.send(`Server ${status}`)
}) 



app.use((req,res,next) => {
    if (status == "ON"){
        next()
    }
    else{
        next(new ServerOFFError())
    }
})
app.use('/logging', router);

function WriteFile(logg){

    fs.appendFileSync(filename,logg)
}

router.post("/info",(req,res,next) => {
    loggly.NotificarInfo(req.body.mensaje)
    WriteFile(req.body.mensaje)
    res.json(req.body.mensaje)
})

router.post('/warning',(req,res,next)=>{
    loggly.NotificarWarning(req.body.mensaje)
    WriteFile(req.body.mensaje)
    res.json(req.body.mensaje)
})

router.post('/error',(req,res,next)=> {
    const logg = req.body.mensaje + ' {Error}'
    loggly.NotificarError(logg)
    WriteFile(logg + '\n')
    res.json(logg)
})
router.post('/debug',(req,res,next)=> {
    const logg = req.body.mensaje + ' {debug}'
    loggly.NotificarDebug(logg)
    WriteFile(logg + '\n')
    res.json(logg)
})
router.get('/isAlive', (req,res,next) => {
    
    res.status(200)
    res.json("OK")


})



function errorHandler(err,req,res,next){
 
    if (err instanceof ServerOFFError){
        res.status(400)
        res.json({
            status: err.status,
            errorCode : err.errorCode,
        })
    }
    else{
        next()
    }
}

app.use(errorHandler)

app.listen(port);
console.log('Logging Api Ready! ' + port);