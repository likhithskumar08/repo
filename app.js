const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const expressError = require('./views/utilities/expressError');
const campgrounds = require('./Router/campground');
const reviews = require('./Router/reviews');
const session = require('express-session');
const flash = require('connect-flash');


mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))//mandatory for post request
app.use(methodOverride('_method'));


app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveuninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    next();
})




app.get('/', (req, res) => {
    // res.send('home')
    console.log('working');
    res.render('home')
})


app.use('*', (req, res, next) => {
    next(new expressError('Page not found!!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("listening on the port 3000!");
})