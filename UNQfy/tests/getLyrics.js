
const rp = require('request-promise');


class musicMatchConnector
{


    getMusicMatchLyrics(musicMatchId){
        var options = {
        uri: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
        qs: {
            apikey: 'e40c3120e9e09fcb8d6a681bf9310ab1',
            track_id: musicMatchId,
        },
        json: true 
      };
      
      rp.get(
        options
      ).then((response) => {
         var header = response.message.header;
         var body = response.message.body;
         if (header.status_code !== 200){
             throw new Error('status code != 200');
         }
      
         var lyrics = body.lyrics.lyrics_body
         
         
         console.log("El resultado de getLyrics es");
         console.log(lyrics)
         

      })
    }

}
const id = process.argv.slice(2,)[0];

const musicMatch = new musicMatchConnector();

musicMatch.getMusicMatchLyrics(id)

