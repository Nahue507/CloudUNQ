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

    getLyrics(musicMatch){
      if (this.lyrics){
        this.lyrics = musicMatch.getLyrics(this.name, artist)
      }
      return this.lyrics;
    }

  }
  
module.exports = Track;