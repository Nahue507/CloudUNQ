
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artista = require("./Artista"); //Para crear artistas nuevos
const Album = require("./Album"); //Para crear y modificar albumes nuevos 
const Playlist = require("./Playlist");//Para crear y modificar playlist nuevas  
const Track = require("./Track");//Para crear nuevos tracks 
const IdManager = require("./IdManager");//Manager de ids
const Usuario = require("./Usuario"); 





class UNQfy {
  constructor()
  {
    this.artistas = [];
    this.albumes = [];
    this.tracks = [];
    this.playsLists = [];
    this.idManager = new IdManager();
    this.usuarios = [];
  }


  //Retorna una lista con todos los artistas agregados a UNQfy
  allArtists()
  {
    return this.artistas;
  }

  //idArtist: entero, número de identificación unívoca del artista 
  //Retorna una lista con todos los álbums agregados a UNQfy del artista
  allAlbumsFrom(idArtist)
  {
    const artista = this.getArtistById(idArtist);
    return artista.getAlbums();
  }


  //idAlbum: Entero que representa unívocamente a cada álbum
  //Retorna una lista con todos los tracks agregados a UNQfy del álbum
  allTracksFrom(idAlbum)
  {
    const album = this.getAlbumById(idAlbum);
    return album.getAllTracks();
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


  //idArtist: entero, número de identificación unívoca del artista
  //Remueve el artista del sistema, junto con sus álbumes y tracks y retorna el artista removido
  removeArtist(idArtist){
    const artistToRemove = this.getArtistById(idArtist);
    this.artistas = this.artistas.filter(artista => artista != artistToRemove);
    artistToRemove.albumes.forEach((album) => {this.removeAlbum(album.id)})
    
    return artistToRemove
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

  //idAlbum: Entero que representa unívocamente a cada álbum
  //Remueve el álbum de UNQfy junto con sus tracks, retorna el álbum
  removeAlbum(idAlbum)
  {
    const albumToRemove = this.getAlbumById(idAlbum);
    this.albumes = this.albumes.filter(album => album!=albumToRemove);
    albumToRemove.tracks.forEach((track) => {this.removeTrack(track.id)})
    return albumToRemove
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

  //idTrack: Entero que representa unívocamente a cada track
  //Remueve la canción de UNQfy, retorna la canción
  removeTrack(idTrack)
  {
    const trackToRemove = this.getTrackById(idTrack);
    this.tracks = this.tracks.filter(track => track.id == trackToRemove);
    return trackToRemove  
  }

  getArtistById(id) {
    
    return this.artistas.filter(artista => artista.id == id)[0];
  }

  getAlbumById(id) {
    return this.albumes.filter(album => album.id == id)[0];

  }

  getTrackId(id){
    return this.tracks.filter(track => track.id == id)[0];
  }


  getPlaylistById(id) {
    return this.playsLists.filter(playlist => playlist.id == id)[0];

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

    let res = [];
    this.artistas.forEach(artista => res = res.concat(artista.getAllTracks()));
    return res.filter(function(track) {return track.hasGenres(genres);} )

  }

  //idArtist: entero, número de identificación unívoca del artista
  //retorna: los tracks interpredatos por el artista con nombre id idArtist
  getTracksFrom(idArtist) 
  {
    const artist = this.getArtistById(idArtist);
    return artist.getAllTracks();
   
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

        
    const artistasConMismoNombre = this.artistas.filter( function(artista) {return artista.name == artistName});    
    let todasLasCanciones = [];
    artistasConMismoNombre.forEach ( artista => todasLasCanciones = todasLasCanciones.concat(artista.getAllTracks()) );
    
    return todasLasCanciones
  
  }

  //name: nombre (string)
  // retirna todos los objetos con nombre name
  searchByName(searchName){

    
    const artists = this.artistas.filter( function(artista) { return artista.name.includes(searchName)} );
    const albums = this.albumes.filter( function(album) { return album.name.includes(searchName)} );
    const tracks = this.tracks.filter( function(track) { return track.name.includes(searchName)} );
    const playlists = this.playsLists.filter( function(playlist) { return playlist.name.includes(searchName) } );



    return {artists: artists, albums: albums, tracks: tracks, playlists: playlists};
    
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
    newPlaylist.id = this.idManager.getIdPlaylist();
    this.playsLists.push(newPlaylist);

    const tracksToAdd = this.tracks.filter(function(track) {return track.hasGenres(genresToInclude);} )
    for ( let i=0 ; i<tracksToAdd.length ; i++)
    {
      if ( newPlaylist.duration() + tracksToAdd[i].duration <= newPlaylist.maxDuration )
      {
        newPlaylist.addTrack(tracksToAdd[i]);
      }
    }

    return newPlaylist

  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artista, Album, Track, Playlist, IdManager,Usuario];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
  //Codigo de Usuario
  addUser(nick){
    const usuarioNuevo = new Usuario(nick);
    usuarioNuevo.id = this.idManager.getIdUsuario;
    this.usuarios.push(usuarioNuevo);
    return usuarioNuevo;

  }
  getUserById(id) {
    return this.usuarios.filter(usuario => usuario.id == id)[0];

  }
  escuchar(idUser,track){
    const user =this.getUserById(idUser);
    user.escuchar(track);

  }
  cancionesQueEscucho(idUser){
    const user = this.getUserById(idUser);
    return user.getCancionesEscuchadas();
  }
  thisIs(idUser){
    const user = this.getUserById(idUser)
    const playlist = new Playlist();
    playlist.id = this.idManager.getIdPlaylist();
    playlist.name = "This is"
    user.tresMasEscuchadas().forEach(track => {
      playlist.addTrack(track);
      console.log("This is " + track.name)
      
    });
  }
}


// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  
};