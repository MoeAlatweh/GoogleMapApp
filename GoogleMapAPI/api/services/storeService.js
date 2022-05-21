
const Store = require('../models/store');
const GoogleMaps = require('../services/googleMapsService');
const googleMaps = new GoogleMaps();

class StoreService {

    async getStoresNear(zipCode) {
      // just to avoid error if input was null
      if(!zipCode){
        return;
      }
        // get the coordinates from function inside googleMapsService.js
        let coordinates = await googleMaps.getCoordinates(zipCode);
        // that's how find the data from MongoDb , get 'Store' from store.js
        let results = await Store.find({
            location: {
             $near: {
                // to make the search within 2 miles  
              $maxDistance: 3218,
              $geometry: {
                type: "Point",
                coordinates: coordinates
              }
             }
            }
        });
        return results;
    }

}

module.exports = StoreService;