
//Se encarga de generar números de identificación para cada clase del sistema que lo necesite

class IdManager{
    constructor()
    {
      this.idArtista = 0;
      this.idAlbum = 0;
      this.idCancion = 0;
      this.idPlaylist = 0;
    }
    getIdArtista (){
      this.idArtista ++;
      return this.idArtista;
    }
    getIdAlbum (){
      this.idAlbum ++;
      return this.idAlbum;
    }
    getIdCancion (){
      this.idCancion ++;
      return this.idCancion;
    }
    getIdPlaylist (){
      this.idPlaylist ++;
      return this.idPlaylist;
    }
  }
  
module.exports = IdManager;