const express = require('express');
const router = express.Router();

const { campgroundSchema } = require('../schemas');

const expressError = require('../views/utilities/expressError');
const catchAsync = require('../views/utilities/CatchAsync');

const Campground = require('../models/campground');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

//creating a camp ground-new
router.get('/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}))
//refering to index.ejs to show all the contents i.e campgrounds list
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log('campgrounds');
    res.render('campgrounds/index', { campgrounds });
}))
//refering to show.ejs - to show contents once user clicks on that link
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    console.log(campground);
    res.render('campgrounds/show', { campground, message: req.flash('message') });
}));
//edit
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

//submitting new campground data

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('message', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


module.exports = router;