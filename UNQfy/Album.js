
class Album{
    constructor(albumData)
    {
      this.id = undefined;
      this.canciones = [];
      this.genres = [];
      this.name = albumData.name;
      this.year = albumData.year;
    }
  
    //Agrega una canción al álbum
    addTrack(newTrack){this.canciones.push(newTrack)};

    //Retorna una lista de tipo array con todas las canciones del álbum
    getTracks(){return this.canciones}
  }
  
module.exports = Album;