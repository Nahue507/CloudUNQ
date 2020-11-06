const unqmod = require("./unqfy")
const fs = require('fs'); 

function getUNQfy(filename = 'data.json') {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
  
  function saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
  }



 

function addArtist(artistJson){
    let unq = getUNQfy()
    let artist = unq.addArtist(artistJson)
    saveUNQfy(unq)
    return artist

}

function parseAlbumsArtist(artistObj){

  artistObj.albums = artistObj.albums.map(elem => AlbumWithoutArtist(elem))
  return artistObj
}

 function getArtistById(id){
  return  ArtistToObject(getUNQfy().getArtistById(id)) 
}

function AlbumWithoutArtist(album){
  return {
          id : album.id,
          name : album.name,
          year : album.year,
          tracks : album.tracks}
}   

function updateArtist(id, nuevosDatos){
  let unq = getUNQfy()
  let artist = getArtistById(id)
  artist.name = nuevosDatos.name
  artist.country = nuevosDatos.country
  saveUNQfy(unq)
  return artist

}

function removeArtist(id){
  let unq= getUNQfy()
  unq.removeArtist(id)
  saveUNQfy(unq)
}

function getArtistsByName(name){
  let unq = getUNQfy()
  const found = unq.searchByName(name);
  const artist = found.artists;
  return artist
}

function parseArtist(list){
  return list.map(elem => ArtistToObject(elem))
}

function ArtistToObject(artist){
  return {
    id : artist.id,
    name: artist.name,
    albums : artist.albums,
    country : artist.country
  }
}

function containsIdArtist(id){
  return getUNQfy().getArtistById(id)
}

function containsArtist(name){

  return getUNQfy().artistExists(name)
}

function containsidAlbum(id){
  return getUNQfy().getAlbumById(id)
}

function containsAlbumByName(name){
  return getUNQfy().albumExists(name)
}

function containsIdTrack(id){
  return getUNQfy().containsIdTrack(id)
}

function updateAlbum(id,albumObj){
  let unq = getUNQfy()
  let album = unq.getAlbumById(id)
  let newAlbum = album
  newAlbum.year = albumObj.year
  saveUNQfy(unq)
  return newAlbum
}

function removeAlbum(id){
  let unq = getUNQfy()
  unq.removeAlbum(id)
  saveUNQfy(unq)
}

function addAlbum(albumData){
  let unq = getUNQfy()
  let album = unq.addAlbum(
    albumData.artistId,
    {name : albumData.name,
    year : albumData.year})
  saveUNQfy(unq)
  return AlbumWithoutArtist(album)
}

function getAlbumById(id){
  return getUNQfy().getAlbumById(id)
}

function getAlbumsByName(name){
  let unq = getUNQfy()
  const found = unq.searchByName(name);
  const albums = found.albums;
  return albums
}





function saveLyrics(idTrack){
  let unq = getUNQfy()
  let track = unq.getTrackById(idTrack)
  const promise = Promise.resolve(track.getLyrics())
  return promise.then((lyrics)=>{
    console.log(lyrics)
    saveUNQfy(unq)
  })

}

function getLyrics(idTrack){
  let unq = getUNQfy()
  saveLyrics(idTrack)
  let track = unq.getTrackById(idTrack)
  return track.lyrics
}

module.exports = {
    addArtist,
    getArtistById,
    parseAlbumsArtist,
    updateArtist,
    removeArtist,
    getArtistsByName,
    containsArtist,
    containsIdArtist,
    containsidAlbum,
    containsAlbumByName,
    addAlbum,
    getAlbumById,
    updateAlbum,
    removeAlbum,
    getAlbumsByName,
    containsIdTrack,
    getLyrics,
}