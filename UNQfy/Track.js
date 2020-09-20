class Track {
    constructor(trackData)
    {
      this.name =trackData.name;
      this.duration = trackData.duration;
      this.genres = trackData.genres;
               
    }

    //Retorna un valor de tipo bool indicando si la canción comparte alguno de los géneros recibidos porparámetro
    hasGenres(listOfGenres){

        var set = new Set (listOfGenres.concat(this.genres));
        return !(listOfGenres.concat(this.genres).length == set.size);
    }

  }
  
module.exports = Track;