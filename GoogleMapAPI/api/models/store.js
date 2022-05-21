// import mongoose
const mongoose = require('mongoose');
// define schema
const storeSchema = mongoose.Schema({
    storeName: String,
    phoneNumber: String,
    // we use bracket to make it flexable
    address: {},
    openStatusText: String,
    addressLines: Array,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    }

})

// we get index of location to use it later to make the search more spacific and faster
// ({ sparse: true }): just to find the index in background
storeSchema.index({ location: '2dsphere' }, { sparse: true });

// export the module to use it
module.exports = mongoose.model('Store', storeSchema);