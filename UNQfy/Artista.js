
class Artista {
    constructor(artistData)
    {
        this.id = undefined;
        this.name =undefined;
        this.country = undefined;
        this.albums = [];

        if (artistData != undefined){
            this.name =artistData.name;
            this.country = artistData.country;
        }
                           
                
    }

    //newAlbum: objeto de tipo Album
    //Agrega un nuevo álbum al artista
    addAlbum(newAlbum){this.albums.push(newAlbum)};

    //Remueve el álbum con el ID enviado
    removeAlbum(albumId){
        this.albums = this.albums.filter((album) => albumId!=album.id)
        
    }


    //Retorna una lista con toda la discografía del artista
    getAlbums()
    {
        return this.albums
    }

    //Retorna una lista de tipo array contodas las canciones del artista
    getAllTracks()
    {
        let res = [];
        
        for (let i=0; i<this.albums.length;i++){
            res = res.concat(this.albums[i].getTracks())
        }
        return res;

    }

  }
  
module.exports = Artista;