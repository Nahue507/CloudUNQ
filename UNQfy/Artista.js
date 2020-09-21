
class Artista {
    constructor(artistData)
    {
        this.id = undefined;
        this.name =artistData.name;
        this.albumes = [];
        this.country = artistData.country;
    }

    //newAlbum: objeto de tipo Album
    //Agrega un nuevo álbum al artista
    addAlbum(newAlbum){this.albumes.push(newAlbum)};


    //Retorna una lista con toda la discografía del artista
    getAlbums()
    {
        return this.albumes
    }
    //Retorna una lista de tipo array contodas las canciones del artista
    getAllTracks()
    {
        let res = [];
        
        for (let i=0; i<this.albumes.length;i++){
            res = res.concat(this.albumes[i].getTracks())
        }
        return res;

    }

  }
  
module.exports = Artista;