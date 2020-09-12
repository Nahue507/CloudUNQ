class Artista {
    constructor(id,nombre, albumes, generos){
        this.id = id
        this.nombre =nombre
        this.albumes = albumes
        this.generos = generos
               
    }
     getCanciones(){
        const tracks = []
        this.albumes.forEach(album => {
            tracks.concat(album.getCanciones())
        });
        return tracks;
        
    }

    //Getters
    getId(){return this.id}
    getNombre(){return this.nombre}
    getAlbumes(){return this.albumes}
    getGeneros(){return this.generos}
    
    
      
    
}