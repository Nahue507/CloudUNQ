class Playlist {
    constructor(name, genres, maxDuration)
    {
        this.id = undefined;
        this.maxDuration = maxDuration;
        this.name =name;
        this.genres = genres;   
        this.tracks = [];          
    }
  
    hasTrack(aTrack)
    {
      return this.tracks.includes(aTrack);
    }
    duration()
    {
      return this.tracks.reduce(function(inicial, track) {return track.duration + inicial}, 0);
    }
   
  
  }
  module.exports = Playlist;