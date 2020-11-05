const { response } = require('express');
const rp= require('request-promise');

class spotifyConnector{
    constructor(access_token){
        this.access_token = access_token;
    }

    getAlbums(atistID){
        const options = {
            url: 'https://api.spotify.com/v1/artists/' + atistID + '/albums',
            headers: { Authorization: 'Bearer ' + this.access_token },
            json: true,
        };

        return rp.get(options).then((response) => {
            return response;
        });
    }

    searchArtist(name){
        const options = {
            url: 'https://api.spotify.com/v1/search',
            headers: { Authorization: 'Bearer ' + this.access_token },
            json: true,
            qs: {
                q:name,
                type: 'artist'
            }
        };
        return rp.get(options).then((response) => {
            return response.artists.items;
        });
    }

}

module.exports = spotifyConnector;