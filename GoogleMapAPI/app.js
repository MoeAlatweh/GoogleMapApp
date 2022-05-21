const express = require('express');
const app = express();
// mongoose is nodejs module use with mongodb database
const mongoose = require('mongoose');
// import store module
const Store = require('./api/models/store');
const StoreService = require('./api/services/storeService');
const storeService = new StoreService();
// to use env file to store API Key
require('dotenv').config()
const port = 3000;

// to allow frontend to access API 
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// to connect the app with mongodb database
// get the link from your mongodb account
// dbPass: CcLRgwSCQdWqCxcL
mongoose.connect('mongodb+srv://Moe:CcLRgwSCQdWqCxcL@cluster0.lzpp1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true,
});

// we need to add limit to make it work   { limit: '50mb' }
app.use(express.json({ limit: '50mb' }));

// to get all stores from mongdb
app.get('/api/stores', (req, res)=>{
  // that's how you get coordinate of zip code
  const zipCode = req.query.zip_code;
  // get zip code coordinate from function inside storeService.js
  storeService.getStoresNear(zipCode)
  // get stores from stores.js
  .then((stores)=>{
      res.status(200).send(stores);
  }).catch((error)=>{
      console.log(error);
  })
})

// we use post method tp send the data to our database
app.post('/api/stores' , (req,res)=>{
    const stores = req.body;
    // we make empty list to append the data stores
    let dbStores = [];
    // make for loop to add all stores with Schema
    for(const store of stores){
        dbStores.push({
            _id: new mongoose.Types.ObjectId(),
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude
                ]
            }
        })
        
    }
    // send the data to mongodb
    Store.create(dbStores, (err,stores)=>{
      if(err){
        res.status(500).send(err);
      } else{
        res.status(200).send(stores);
      }
    })
    // console.log(req);
    // console.log(dbStores);
    // res.send("Data Posted Finally !!!");
});



// add delete functionallity
app.delete('/api/stores', (req,res)=>{
    Store.deleteMany({} , (result)=>{
        res.status(200).send(result);
    })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})