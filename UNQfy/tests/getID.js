
const rp = require('request-promise');


class musicMatchConnector
{
    

    getMusicMatchId(track_name){
        var options = {
            uri: 'http://api.musixmatch.com/ws/1.1/track.search',
            qs: {
                apikey: 'e40c3120e9e09fcb8d6a681bf9310ab1',
                q_track: track_name,
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
          
            
             for (let index = 0; index < body.track_list.length; index++) {
                 

                console.log(body.track_list[index].track.track_name)

                              
                console.log("-->> Track_id: " + body.track_list[index].track.track_id);
                console.log("-->> Commontrack_id: " + body.track_list[index].track.commontrack_id);
  
             }
             
                          
          }).catch((error) => {
             console.log('algo salio mal', error);
          });    

    }


}

const track = process.argv.slice(2,)[0];

const musicMatch = new musicMatchConnector();

console.log("Track buscada: "+track);
musicMatch.getMusicMatchId(track)







