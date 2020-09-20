
class Album{
    constructor(albumData)
    {
      this.id = undefined;
      this.canciones = [];
      this.genres = [];
      this.name = albumData.name;
      this.year = albumData.year;
    }
  
    addTrack(newTrack){this.canciones.push(newTrack)};
    getTracks(){return this.canciones}
  }
  
module.exports = Album;