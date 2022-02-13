require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities')
const imagelinks = require('./imagelinks')
const {intro, middle, end} = require('./descriptionText')
const Campground = require("../models/campground");
const {descriptors, places} = require('./seedHelpers')


mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 375; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61b50d8d496e51526b0811ce',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `${sample(intro)} ${sample(middle)} ${sample(end)}`,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                sample(imagelinks),
                sample(imagelinks),
                sample(imagelinks),
                sample(imagelinks)
            ]
        })
        console.log(camp)
        try{await camp.save()} catch(err){console.log(err)}
    }
}

seedDB().then(()=> {
    mongoose.connection.close()
    console.log("Database Disconnected")
})