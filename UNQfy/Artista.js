
class Artista {
    constructor(artistData)
    {
        this.id = undefined;
        this.name =artistData.name;
        this.albumes = [];
        this.country = artistData.country;
    }
    addAlbum(newAlbum){this.albumes.push(newAlbum)};
  }
  
module.exports = Artista;