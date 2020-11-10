const rp = require('request-promise');


class musicMatchConnector
{
    
    
    getLyrics(track, unq)
    {
        
       const musicMatchId = this.getMusicMatchId(track, unq)
       //this.getMusicMatchLyrics(musicMatchId)

        
    }





    getMusicMatchId(track, unq){
        var options = {
            uri: 'http://api.musixmatch.com/ws/1.1/track.search',
            qs: {
                apikey: 'e40c3120e9e09fcb8d6a681bf9310ab1',
                q_track: 'Somebody That I Used to Know',
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
          
             var musicMatchId = body.track_list[0].track.track_id;
             
             
             console.log("El id de la canción es");
             console.log(musicMatchId)
             this.getMusicMatchLyrics(track, '15953433', unq);




          }).catch((error) => {
             console.log('algo salio mal', error);
          });    

    }



    getMusicMatchLyrics(track, musicMatchId, unq){
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
         track.saveLyrics(lyrics, unq);

      })
    }

}
module.exports = musicMatchConnector;