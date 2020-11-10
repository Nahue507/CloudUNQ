class Track {
    constructor(trackData)
    {
      this.id = undefined; 
      this.name =undefined;
      this.duration = undefined;
      this.genres = undefined; 
      this.lyrics = undefined;

      if (trackData!= undefined)
      {
        this.name =trackData.name;
        this.duration = trackData.duration;
        this.genres = trackData.genres;

      }
      
               
    }

    //Retorna un valor de tipo bool indicando si la canción comparte alguno de los géneros recibidos porparámetro
    hasGenres(listOfGenres){

        var set = new Set (listOfGenres.concat(this.genres));
        return !(listOfGenres.concat(this.genres).length == set.size);
    }

    getLyrics(musicMatch, unq){
      if (this.lyrics === undefined){
        this.lyrics = musicMatch.getLyrics(this, unq)
        
      }
      return this.lyrics;
    }

    saveLyrics(lyrics, unq){
      this.lyrics = lyrics
      unq.save('data.json')
    }

  }
  
module.exports = Track;