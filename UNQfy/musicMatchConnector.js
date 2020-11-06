const rp = require('request-promise');


class musicMatchConnector{
    constructor(){
        const artistId = undefined;
    }
    getArtistID(artistName){
        var options = {
            uri: 'http://api.musixmatch.com/ws/1.1/artist.search',
            qs: {
                apikey: 'e40c3120e9e09fcb8d6a681bf9310ab1',
                q_artist: artistName,
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp.get(options).then((response) => {
            var header = response.message.header;
            var body = response.message.body;
            if (header.status_code !== 200){
                throw new Error('status code != 200');
            }
      
            var artists = body.artist_list.map((artist => artist.artist));
            //console.log(`Se econtraron ${artistNames.length} artistas`);
            console.log("Artista: "+artists[0].artist_name, " ID: "+artists[0].artist_id);
            this.artistId = artists[0].artist_id;
            
        }).catch((error) => {console.log('algo salio mal', error);});
        return this.artistId;
    }

}
module.exports = musicMatchConnector;