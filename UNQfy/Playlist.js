class Playlist {
    constructor(name, genres, maxDuration)
    {
        this.id = undefined;
        this.maxDuration = maxDuration;
        this.name =name;
        this.genres = genres;   
        this.tracks = [];          
    }
  


    //Retorna un valor de tipo bool indicando di una canción se encuentra en la playlist
    hasTrack(aTrack)
    {
      return this.tracks.includes(aTrack);
    }

    //atrack: objeto de tpo Track
    //Agrega el objeto aTrack a la lista Tracks
    addTrack(aTrack)
    {
        this.tracks.push(aTrack);
    }

    //Retorna la sumatoria de duraciones de todas las canciones de la playlist
    duration()
    {
      return this.tracks.reduce(function(inicial, track) {return track.duration + inicial}, 0);
    }
   
  
  }
  module.exports = Playlist;