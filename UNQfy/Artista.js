class Artista {
    constructor(name,country){
        this.id = undefined
        this.name =name
        this.albumes = []
        this.generos = undefined
        this.country = country;
               
    }
     getCanciones(){
        const tracks = []
        this.albumes.forEach(album => {
            tracks.concat(album.getCanciones())
        });
        return tracks;
        
    }
    nuevoAlbum(album){
        this.albumes.push(album);
    }
    //Getters
    getId(){return this.id}
    getNombre(){return this.nombre}
    getAlbumes(){return this.albumes}
    getGeneros(){return this.generos}
    
    
      
    
}
module.exports = {
    Artista:Artista,
    
  };