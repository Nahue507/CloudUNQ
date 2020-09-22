

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

function main() {
  

  const allArgs = process.argv.slice(2,);
  const commandName = allArgs[0];
  const commandArgs = allArgs.slice(1)

  console.log(commandName);
  console.log(commandArgs);

  
  if (commandName === "addArtist"){

    const unqfy = getUNQfy();
    if (!unqfy.artistExists(commandArgs[0]))
    {
      const newArtist = unqfy.addArtist({ name: commandArgs[0], country:commandArgs[1]});
      saveUNQfy(unqfy);
      console.log('Se agregó el artista ', newArtist.name);
    }
    else{console.log("El artista ya existe")}
  }



  if (commandName === "addAlbum"){
    const unqfy = getUNQfy();
    
    if ( unqfy.artistExists(commandArgs[2]) && !(unqfy.albumExists(commandArgs[0])) )
    {
      const artist = unqfy.getArtistById(unqfy.searchByName(commandArgs[2]).artists[0].id);
      const newAlbum = unqfy.addAlbum( artist.id,{ name: commandArgs[0], year: Number(commandArgs[1])});
      saveUNQfy(unqfy);
      console.log('Se agregó el álbum ', newAlbum.name);
    }
    else
    {
      console.log("No se completó la operación, controle que el artista exista y que el álbum no haya sido ingresado anteriormente");
    }
    
  }

  if (commandName === "addTrack"){
    const unqfy = getUNQfy();
    
    if (unqfy.albumExists(commandArgs[3]) && !(unqfy.trackExists(commandArgs[0])) )
    {
      const album = unqfy.getAlbumById(unqfy.searchByName(commandArgs[3]).albums[0].id);
      const newTrack = unqfy.addTrack(album.id ,{ name: commandArgs[0], duration: Number(commandArgs[1]), generes:commandArgs[2] });
      saveUNQfy(unqfy);
      console.log('Se agregó el track ', newTrack.name);
    }
    else
    {
      console.log("No se completó la operación, controle que el álbum exista y que la canción no haya sido ingresada anteriormente");
    }
    
  }

  if (commandName === "removeArtist")
  {
    const unqfy = getUNQfy(commandArgs[0]);
    if (unqfy.artistExists())
    {
      const idArtist = unqfy.searchByName(commandArgs[0]).artists[0].id;
      unqfy.removeArtist(idArtist);
      saveUNQfy(unqfy);
      console.log("El artista fue removido del sistema")
    }
    
  }

  if (commandName === "removeAlbum")
  {
    const unqfy = getUNQfy();
    if (unqfy.albumExists(commandArgs[0]))
    {
      const idAlbum = unqfy.searchByName(commandArgs[0]).albums[0].id;
      unqfy.removeAlbum(idAlbum);
      saveUNQfy(unqfy);
      console.log("El álbum fue removido del sistema")
    }
    
  }


  if (commandName === "removeTrack")
  {
    const unqfy = getUNQfy();
    if (unqfy.trackExists(commandArgs[0]))
    {
      const idTrack = unqfy.searchByName(commandArgs[0]).tracks[0].id;
      unqfy.removeTrack(idTrack);
      saveUNQfy(unqfy);
      console.log("La canción fue removida del sistema")
    }
    
  }

  if (commandName === "browseTracks")
  {
    const unqfy = getUNQfy();
    console.log("Listado de canciones:");
    unqfy.tracks.forEach(track => console.log(track.name));
  }

  if (commandName === "browseAlbums")
  {
    const unqfy = getUNQfy();
    console.log("Listado de álbumes:")
    unqfy.albumes.forEach(album => console.log(album.name))
  } 

  if (commandName === "browseArtists")
  {
    const unqfy = getUNQfy();
    console.log("Listado de artistas:")
    unqfy.artistas.forEach(artist => console.log(artist.name))
  } 
  
  if (commandName === "browsePlaylists")
  {
    const unqfy = getUNQfy();
    console.log("Listado de playlists:")
    unqfy.playsLists.forEach(playlist => console.log(playlist.name))
  } 

  if (commandName === "browseEverything")
  {
    const unqfy = getUNQfy();
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
    const unqfy = getUNQfy();
    console.log("Tracks encontrados:");
    console.log(unqfy.getTracksMatchingArtist(commandArgs[0]));
  }

}

main();
