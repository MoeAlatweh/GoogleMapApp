// we use it to fetch data in easy way
const axios = require('axios');
// to get coordinate of address from google map we use url:
// https://maps.googleapis.com/maps/api/geocode/json?address=YourAddress&key=yourAPIkey
const googleMapsURL = 'https://maps.googleapis.com/maps/api/geocode/json';
// we use async & await to ensure that function return promise
class GoogleMaps {
    async getCoordinates(zipCode) {
        let coordinates = [];
        // with axios we can add parameters to add them to URL
        await axios.get(googleMapsURL, {
            params: {
                address: zipCode,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        }).then((response)=>{
            const data = response.data;
            coordinates = [
                // google map use 'results' as list of coordinates
                // and that's how you get coordinates of search
                data.results[0].geometry.location.lng,
                data.results[0].geometry.location.lat
            ]
        }).catch((error)=>{
            throw new Error(error);
        })
        
        return coordinates;
    }
}

module.exports = GoogleMaps;