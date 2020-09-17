class Playlist {
    constructor(id,nombre){
        this.id = id
        this.nombre =nombre
        this.tracks = []               
    }

    //Getters
    getId(){return this.id}
    getNombre(){return this.nombre}
    getTracks(){return this.tracks}

    //Recorre todas las canciones y arma una lista de los generos
    //getGeneros(){this.getTracks().forEach((track)=>(track.getGeneros()))}
    //getDuracion(){}//recorre todas las canciones y suma la duración
    //Getters
      
    //Setters
    addTrack(cancion){this.tracks.push(cancion)}
    removeTrack(cancion){this.tracks.pop(cancion)}

}
exports = Playlist