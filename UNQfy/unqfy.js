
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artista = require("./Artista"); //Para crear artistas nuevos
const Album = require("./Album"); //Para crear y modificar albumes nuevos 
const Playlist = require("./Playlist");//Para crear y modificar playlist nuevas  
const Track = require("./Track");//Para crear nuevos tracks 
const IdManager = require("./IdManager");//Manager de ids





class UNQfy {
  constructor()
  {
    this.artistas = [];
    this.albumes = [];
    this.tracks = [];
    this.playsLists = [];
    this.idManager = new IdManager();
  }


  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData){
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    
    const nuevoArtista = new Artista(artistData);
    nuevoArtista.id = this.idManager.getIdArtista();
    this.artistas.push(nuevoArtista);
    return nuevoArtista;
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
    const nuevoArtista = this.getArtistById(artistId);
    const nuevoAlbum = new Album(albumData);
    nuevoAlbum.id = this.idManager.getIdAlbum();
    nuevoArtista.addAlbum(nuevoAlbum);
    this.albumes.push(nuevoAlbum);
    return nuevoAlbum;
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
    const album = this.getAlbumById(albumId);
    const track = new Track(trackData);
    track.id = this.idManager.getIdCancion();
    album.addTrack(track);
    this.tracks.push(track);
    return track
  }

  getArtistById(id) {
    
    return this.artistas.filter(artista => artista.id == id)[0];
  }

  getAlbumById(id) {
    return this.albumes.filter(album => album.id == id)[0];

  }

  getTrackById(id) {
    return this.tracks.filter(track => track.id == id)[0];

  }

  getPlaylistById(id) {
    return this.playsLists.filter(playlist => playlist.id == id)[0];

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

    //this.artistas[0].albumes.array.forEach(element => {   });

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */
    const newPlaylist = new Playlist(name, genresToInclude, maxDuration);
    newPlaylist.id = this.IdManager.getIdPlaylist();
    this.playsLists.push(newPlaylist);

  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artista, Album, Track, Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  
};

