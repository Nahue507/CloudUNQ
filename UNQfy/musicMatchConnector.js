const rp = require('request-promise');


class musicMatchConnector
{
    
    
    getLyrics(track)
    {
        
       const musicMatchId = this.getMusicMatchId(track)
       //this.getMusicMatchLyrics(musicMatchId)

        
    }





    getMusicMatchId(track){
        var options = {
            uri: 'http://api.musixmatch.com/ws/1.1/track.search',
            qs: {
                apikey: 'e40c3120e9e09fcb8d6a681bf9310ab1',
                q_track: track.name,
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
          
             var musicMatchId = body.track_list[0].track.commontrack_id;
             
             
             console.log("El id de la canción es");
             console.log(musicMatchId)
             
          }).then((response) => {
            
            this.getMusicMatchLyrics(track, response)

          }).catch((error) => {
             console.log('algo salio mal', error);
          });    

    }



    getMusicMatchLyrics(track, MusicMatchId){
        var options = {
        uri: 'http://api.musixmatch.com/ws/1.1/track.search',
        qs: {
            apikey: 'e40c3120e9e09fcb8d6a681bf9310ab1',
            q_track: track.name,
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
      
         var musicMatchId = body.track_list[0].track.commontrack_id;
         
         
         console.log("El id de la canción es");
         console.log(musicMatchId)
         
      })
    }

}
module.exports = musicMatchConnector;