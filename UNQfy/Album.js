
class Album{
    constructor(albumData)
    {
      this.id = undefined;
      this.tracks = [];
      this.genres = [];
      this.name = undefined;
      this.year = undefined;
      if (albumData!= undefined){
        this.name = albumData.name;
        this.year = albumData.year;
      }
      
    }
  
    //newTrack: objeto de tipo Track
    //Agrega una canción al álbum
    addTrack(newTrack){this.tracks.push(newTrack)};

    
    //Retorna una lista de tipo array con todas las canciones del álbum
    getTracks(){return this.tracks}
  
    toJSON() {
      return {id: this.id , tracks: this.tracks, name: this.name , year: this.year}; 
    }
   
  }
  
module.exports = Album;