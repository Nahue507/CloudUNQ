class Album{
    constructor(id,canciones,generos){
        this.id = id
        this.canciones = canciones
        this.generos = generos
               
    }
    //Getters
    getCanciones(){
        return this.canciones;
    }
    getGenero(){
        return this.generos;
    }
    getId(){
        return this.id;
    }
}
exports = Album