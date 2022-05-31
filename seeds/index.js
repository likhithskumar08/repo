const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB!!!')
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Sapiente cupiditate dolore est, deserunt totam eligendi repellat itaque ullam.Vitae maxime sunt beatae cum optio? Repellendus ab aliquam a! Fuga, animi.',
            price: Math.floor(Math.random() * 20) + 10,
        })
        // console.log(`${cities[random1000].city}, ${cities[random1000].state}`);
        await camp.save();

    }
}

seedDB();//.then(() => {
//     mongoose.connection.close();
// });