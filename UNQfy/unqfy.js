
const picklify = require('picklify'); // para cargar/guarfar unqfy
const axios = require('axios');
const fs = require('fs'); // para cargar/guarfar unqfy
const rp = require ('request-promise');
const Artista = require("./Artista"); //Para crear artistas nuevos
const Album = require("./Album"); //Para crear y modificar albums nuevos 
const Playlist = require("./Playlist");//Para crear y modificar playlist nuevas  
const Track = require("./Track");//Para crear nuevos tracks 
const IdManager = require("./IdManager");//Manager de ids
const Usuario = require("./Usuario"); 
const spotifyConnector = require('./spotifyConnector'); // Gestor de la conexión a Spotify
const musicMatchConnector = require('./musicMatchConnector'); // Gestor de la conexión a MusicMatch
const NEWSLETTER_API_HOST = "http://172.20.0.10:8085";



class UNQfy {
  constructor()
  {
    this.artistas = [];
    this.albums = [];
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
  addArtist(artistData)
  {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    if (!this.artistExists(artistData.name))
      {
        const nuevoArtista = new Artista(artistData);
        nuevoArtista.id = this.idManager.getIdArtista();
        this.artistas.push(nuevoArtista);
        console.log('Se agregó el artista ', nuevoArtista.name);
        return nuevoArtista;
      }
      else
      {
        console.log("El artista ya existe")
      }
  
  }


  //idArtist: entero, número de identificación unívoca del artista
  //Remueve el artista del sistema, junto con sus álbumes y tracks
  removeArtist(idArtist){

    const artistToRemove = this.getArtistById(idArtist);
    artistToRemove.albums.forEach((album) => {this.removeAlbum(album.id)})
    this.artistas = this.artistas.filter(artista => artista != artistToRemove);
     //=====================NEWSLETTER POST==================================//

    const data = { artistId: artistToRemove, };
    axios
    .delete(`${NEWSLETTER_API_HOST}/api/subscriptions`, data)
    .then(response => {
      
    })
    .catch(error => console.error(error));
    //=====================================================================//
    
    
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) 
  {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
 
    
    if (!(this.albumExists(albumData.name)))
    {
      const nuevoArtista = this.getArtistById(artistId);
      const nuevoAlbum = new Album(albumData);
      nuevoAlbum.id = this.idManager.getIdAlbum();
      nuevoArtista.addAlbum(nuevoAlbum);
      this.albums.push(nuevoAlbum);
      console.log('Se agregó el álbum ', nuevoAlbum.name);
      //=====================NEWSLETTER POST==================================//

      const data = {
        artistId: nuevoArtista.id,
        subject: `Nuevo Album para artsta, ${nuevoArtista.name}` ,
        message: `Se ha agregado el album ${nuevoAlbum.name} al artista ${nuevoArtista.name}`
      };

      axios
      .post(`${NEWSLETTER_API_HOST}/api/notify`, data)
      .then(response => {
        console.log("Notificación de nuevo álbum enviada")
      })
      .catch(error => console.error(error));
      //=====================================================================//


      return nuevoAlbum;
    }
    else
    {
      console.log("No se completó la operación, controle que el álbum no haya sido ingresado anteriormente");
    }
  
  }

  //idAlbum: Entero que representa unívocamente a cada álbum
  //Remueve el álbum de UNQfy junto con sus tracks
  removeAlbum(idAlbum)
  {
 
    const albumToRemove = this.getAlbumById(idAlbum);
    this.artistas.forEach((artista)=>{artista.removeAlbum(idAlbum)})
    albumToRemove.tracks.forEach((track) => {this.removeTrack(track.id)});
    this.albums = this.albums.filter(album => album!=albumToRemove);
    
    
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) 
  {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
    const album = this.getAlbumById(albumId);
    if (!(this.trackExists(trackData.name)) )
    {
      const track = new Track(trackData);
      track.id = this.idManager.getIdCancion();
      album.addTrack(track);
      this.tracks.push(track);
      console.log('Se agregó el track ', track.name);
      this.save('data.json')
      return track
    }
    else
    {
     console.log("No se completó la operación, controle que la canción no haya sido ingresada anteriormente");
    }
    
  }

  //idTrack: Entero que representa unívocamente a cada track
  //Remueve la canción de UNQfy, retorna la canción
  removeTrack(idTrack)
  {

    const trackToRemove = this.getTrackById(idTrack);
    this.tracks = this.tracks.filter(track => track.id != idTrack);
    this.playsLists.forEach(playlist => playlist.removeTrack(trackToRemove));     
  }

  getArtistById(id) {
    
    if (this.artistas.filter(artista => artista.id == id))
    {
      return this.artistas.filter(artista => artista.id == id)[0];
    }
    
  }

  getAlbumById(id) {

    if (this.albums.filter(album => album.id == id))
    {
      return this.albums.filter(album => album.id == id)[0];
    }
    

  }

  getTrackById(id){
    if (this.tracks.filter(track => track.id == id))
    {
      return this.tracks.filter(track => track.id == id)[0];
    }
  }


  getPlaylistById(id) {
    if (this.playsLists.filter(playlist => playlist.id == id))
    {
      return this.playsLists.filter(playlist => playlist.id == id)[0];
    }
    

  }

  getUserById(id) {
    const usuario = this.usuarios.find(usuario => usuario.id == id);
    if(usuario != undefined){
      return usuario
    }

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) 
  {
     
    return this.tracks.filter(track => track.hasGenres(genres));

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
  searchByName(string){
    
    const searchName = string.toLowerCase()
    const artists = this.artistas.filter( function(artista) { return artista.name.toLowerCase().includes(searchName)} );
    const albums = this.albums.filter( function(album) { return album.name.toLowerCase().includes(searchName)} );
    const tracks = this.tracks.filter( function(track) { return track.name.includes(searchName)} );
    const playlists = this.playsLists.filter( function(playlist) { return playlist.name.includes(searchName) } );
    
    
    return {artists: artists, albums: albums, tracks: tracks, playlists: playlists};
    
  }

  artistExists(artistName)
  {
    return this.searchByName(artistName).artists[0] != undefined;
  }

  albumExists(albumName)
  {
    return this.searchByName(albumName).albums[0] != undefined;
  }

  trackExists(trackName)
  {
    return this.searchByName(trackName).tracks[0] != undefined;
  }

  playlistExists(playlistName)
  {
    return this.searchByName(playlistName).playlists[0] != undefined;
  }





  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {

    const newPlaylist = new Playlist(name, genresToInclude, maxDuration);
    newPlaylist.id = this.idManager.getIdPlaylist();
    this.playsLists.push(newPlaylist);
    const tracksToAdd = this.getTracksMatchingGenres(genresToInclude);
        
    for ( let i=0 ; i<tracksToAdd.length ; i++)
    {
      if ( newPlaylist.duration() + tracksToAdd[i].duration <= newPlaylist.maxDuration )
      {
        newPlaylist.addTrack(tracksToAdd[i]);
      }
    }
    return newPlaylist
  }

 
  //Codigo de Usuario
  //retorna true si ya esta en uso ese usuario
  userEnUso(nick)
  {
     const user = this.usuarios.find(usuario => usuario.nickName == nick)
     return user != undefined;
  }

  getUserByName(userName) {
    const user = this.usuarios.find(usuario => usuario.nickName == userName);

    if(user != undefined){
      
      return user
    }
    else{
      console.log("No existe usario con ese nick")
    }
  }
  
  addUser(nick)
  {
    if(this.userEnUso(nick))
    {
      console.log("User en uso")
    }
    else
    {
      const usuarioNuevo = new Usuario(nick);
      usuarioNuevo.id = this.idManager.getIdUsuario();
      this.usuarios.push(usuarioNuevo);
      console.log(usuarioNuevo.nickName, "ha sido agregado a UNQfy")
    }
  }

  
  escuchar(userName, trackName)
  {
    if(this.trackExists(trackName) && this.userEnUso(userName))
    {
      const user = this.usuarios.find(user => user.nickName == userName)
      const trackToPlay = this.searchByName(trackName).tracks[0];
      user.escuchando(trackToPlay);
      console.log("Estas escuchando" ,trackToPlay.name)
    }
    else
    {
      console.log("Verificar que el track y el usuario con existan");
    }


  }
  cancionesQueEscucho(userName)
  {
    const user = this.getUserByName(userName)
    return user.getCancionesEscuchadas();
  }
  
  thisIs(idUser)
  {
    if(this.userEnUso(idUser) && this.cancionesQueEscucho(idUser).size>=3)
    {
      const user = this.getUserById(idUser)
      const playlist = new Playlist();
      const masEscuchadas =user.tresMasEscuchadas()
      playlist.id = this.idManager.getIdPlaylist();
      playlist.name = "This is"
      masEscuchadas.forEach(track => {playlist.addTrack(track);console.log("This is " + track.name)});
    }
    else
    {
      console.log("No existe ese usuario con", idUser)
    }
  }

  // artistName: String, nombre del artista a buscar
  // connexionManager: Instancia del gestor de conexión a spotify
  // retorna: una promesa con todos los artistas que matchean el nombre
  getSpotifyIdFor(artistName)
  {
    
    const connexionManager= new spotifyConnector(this.getSpotifyToken())

    const found = connexionManager.searchArtist(artistName);
    return found;
  }

       

  getAlbumsForArtist(artistName)
  {
    
    const connexionManager= new spotifyConnector(this.getSpotifyToken())
    
    //Obtengo todos los artistas que matchean el nombre enviado
    const spotifyId = this.getSpotifyIdFor(artistName)
    //Obtengo los álbumes del primer artista de la lista obtenida
    const albums = spotifyId.then((response) => connexionManager.getAlbums(response[0].id));
    //Obtengo el UNQfy ID del artista
    const artistID = this.searchByName(artistName).artists[0].id;
    
    if ( artistID )
    {
      albums.then((response) => response.items.forEach(item =>  this.addAlbum(artistID, {name: item.name, year: item.release_date.substring(0, 4)}) ));
    }
  }


  

  getSpotifyToken()
  {
    let data = fs.readFileSync('./spotifyCreds.json');
    data = JSON.parse(data);
    return data.access_token;
  }
  
  //getArtistIdFromMusicmatch(artistName){
  //  const connexionManager = new musicMatchConnector();
  //  const id = connexionManager.getArtistID(artistName);
  //  //id.then((response)=> console.log(response));
  //}

  getLyrics(trackID)
  {

    const track = this.getTrackById(trackID)
    const lyrics = track.getLyrics(new musicMatchConnector(), this);
    return lyrics;
    

  }
  

  

  save(filename) 
  {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) 
  {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artista, Album, Track, Playlist, IdManager,Usuario];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}


// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
  
};