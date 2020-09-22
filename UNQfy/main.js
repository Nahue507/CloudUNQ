

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

  console.log(allArgs);
  console.log(commandArgs);

  if (commandName === "addArtist"){
    const unqfy = getUNQfy();
    const newArtist = unqfy.addArtist({ name: commandArgs[0], country:commandArgs[1]});
    saveUNQfy(unqfy);
    console.log('Se agregó el artista ', newArtist.name);
  }

  if (commandName === "addAlbumt"){
    const unqfy = getUNQfy();
    const newAlbum = unqfy.addArtist({ name: commandArgs[0], year: Number(commandArgs[1])});
    saveUNQfy(unqfy);
    console.log('Se agregó el álbum ', newAlbum.name);
  }


}

main();
