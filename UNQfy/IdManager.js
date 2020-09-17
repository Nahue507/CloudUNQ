class IdManager{
    constructor(){
        this.idArtista = 0;
        this.idAlbum = 0;
        this.idUsuario = 0;
    }
    getIdArtista (){
        var res = this.idArtista;
        this.idArtista = this.idArtista + 1
        return res;
    }
    getIdAlbum (){
        var res = this.idAlbum;
        this.idAlbum = this.idAlbum + 1
        return res;
    }
    getIdUsuario (){
        var res = this.idUsuario;
        this.idUsuario = this.idUsuario + 1
        return res;
    }
}

module.exports = {
    IdManager:IdManager,
    
  };