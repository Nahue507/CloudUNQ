class Album{
    constructor(name,year){
        this.id = undefined;
        this.canciones = [];
        this.generos = [];
        this.name = name;
        this.year = year;
               
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
module.exports = {
    Album:Album,
    
  };