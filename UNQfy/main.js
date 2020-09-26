

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqfy = require('./unqfy');
const unqmod = require('./unqfy'); // importamos el modulo unqfy

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista                      //addArtist(artistData), removeArtist(idArtist)
    - Alta y Baja de Albums                       //addAlbum(albumData), removeAlbum(idAlbum)
    - Alta y Baja de tracks                       //addTrack(trackData), removeTrack(trackData)

    - Listar todos los Artistas                   //allArtists()
    - Listar todos los albumes de un artista      //allAlbumsFrom(idArtist)
    - Listar todos los tracks de un album         //allTracksFrom(idAlbum)

    - Busqueda de canciones intepretadas por un determinado artista  //getTracksFrom(idArtist)
    - Busqueda de canciones por genero            //getTracksMatchingGenres(genres)

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.                         //searchByName(searchName)

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.
                                                  //createPlaylist(name, genresToInclude, maxDuration)

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

function main() 
{
  

  const allArgs = process.argv.slice(2,);
  const commandName = allArgs[0];
  const commandArgs = allArgs.slice(1)
  const unqfy = getUNQfy()
  
  
  if (commandName === "addArtist")
  {
    const newArtist = unqfy.addArtist({ name: commandArgs[0], country:commandArgs[1]});
  }



  if (commandName === "addAlbum")
  {
    const artist = unqfy.searchByName(commandArgs[2]).artists[0];
    if ( artist )
    {
      const newAlbum = unqfy.addAlbum( artist.id,{ name: commandArgs[0], year: Number(commandArgs[1])});
    }
    else
    {
      console.log("El artista no está ingresado en sistema");
    }
    
  }
 


  if (commandName === "addTrack")
  
  {
    const album = unqfy.searchByName(commandArgs[3]).albums[0];
    if (album)
    {
      const newTrack = unqfy.addTrack(album.id ,{ name: commandArgs[0], duration: Number(commandArgs[1]), genres:commandArgs[2] });
    }
    else
    {
      console.log("El álbum no está ingresado en sistema");
    }
    
  }

  
  if (commandName === "removeArtist")
  {
    const idArtist = unqfy.searchByName(commandArgs[0]).artists[0].id;
    unqfy.removeArtist(idArtist);
  }
  
  if (commandName === "removeAlbum")
  {
    const album = unqfy.searchByName(commandArgs[0]).albums[0];
    if ( album )
    {
      unqfy.removeAlbum(album.id);
    }
    
  }
    
  
  if (commandName === "removeTrack")
  {
    const idTrack = unqfy.searchByName(commandArgs[0]).tracks[0].id;
    unqfy.removeTrack(idTrack);
  }


  if (commandName === "browseTracks")
  {
    
    console.log("Listado de canciones:");
    unqfy.tracks.forEach(track => console.log(track.name));
  }

  if (commandName === "browseAlbums")
  {
    console.log("Listado de álbumes:")
    unqfy.albumes.forEach(album => console.log(album.name))
  } 

  if (commandName === "browseArtists")
  {
    console.log("Listado de artistas:")
    unqfy.artistas.forEach(artist => console.log(artist.name))
  } 
  
  if (commandName === "browsePlaylists")
  {
    console.log("Listado de playlists:")
    unqfy.playsLists.forEach(playlist => console.log(playlist.name))
  } 

  if (commandName === "browseEverything")
  {
    
    const found = unqfy.searchByName(commandArgs[0]);
    
    console.log("Artistas encontrados:")
    found.artists.forEach(artist => console.log(artist.name))
    
    console.log("Álbumes encontrados:")
    found.albums.forEach(album => console.log(album.name))
    
    console.log("Tracks encontrados:")
    found.tracks.forEach(track => console.log(track.name))
    
    console.log("Playlists encontrados:")
    found.playlists.forEach(playlist => console.log(playlist.name))
  }

  if (commandName === "browseTracksFrom")
  {
    const found = unqfy.getTracksMatchingArtist(commandArgs[0]);
    console.log("Tracks encontrados:");
    found.forEach(track => console.log(track.name));
  }

  if (commandName === "browseTracksMatchingGenres")
  {
    const found = unqfy.getTracksMatchingGenres(commandArgs)
    console.log("Tracks encontrados:");
    found.forEach(track => console.log(track.name));
  }

  if (commandName === "createPlaylist")
  {
    
    if  (!unqfy.playlistExists(commandArgs[0]))
    {
      const newPlaylist = unqfy.createPlaylist(commandArgs[0], [commandArgs[1]], Number(commandArgs[2]));
      console.log( newPlaylist.name, ": se ha creado con éxito y contiene los siguientes tracks:");
      newPlaylist.tracks.forEach(track => console.log(track.name));
    }
    else
    {
      console.log("Ya existe una playlist con ese nombre");
    }
    
  }

  if (commandName === "addUser")
  {
    unqfy.addUser(commandArgs[0]);
  }
  
  if (commandName === "escuchar")
  {
    unqfy.escuchar(commandArgs[0],commandArgs[1]);
  }
  
  
  if(commandName === "cancionesQueEscucho")
  {
    console.log("Escuchaste")
    unqfy.cancionesQueEscucho(commandArgs[0]).forEach(track => {console.log(track.name)});
  }
  
  if(commandName === "thisIs")
  {
    unqfy.thisIs(commandArgs[0]);
  }

  if (commandName === "help")
  {
    console.log("Lista de comandos:");
    console.log("addArtist <artist name> <country>");
    console.log("addAlbum <album name> <year> <artist>");
    console.log("addTrack <track name> <length> <genres> <album>");
    console.log("removeArtist <artist name>");
    console.log("removeAlbum <album name>");
    console.log("removeTrack <track name>");
    console.log("browseTracks");
    console.log("browseAlbums");
    console.log("browseArtists");
    console.log("browsePlaylists");
    console.log("browseEverything <pattern to match>");
    console.log("browseTracksFrom <artist name>");
    console.log("browseTracksMatchingGenres <list os genres to search>");
    console.log("createPlaylist <name> <genres> <max duration>");
    console.log("addUser <user nick>");
    console.log("escuchar <track name> <user>");
    console.log("cancionesQueEscucho <user>");
    console.log("thisIs <user>");

  }
  
saveUNQfy(unqfy);  
  
}



main();
