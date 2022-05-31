const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const review = require('../models/review');

const expressError = require('../views/utilities/expressError');
const catchAsync = require('../views/utilities/CatchAsync');

const { reviewSchema } = require('../schemas');



const ValidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}



router.post('/', ValidateReview, catchAsync(async (req, res) => {
    // res.send('works')
    const campground = await Campground.findById(req.params.id);
    // console.log(req.body.Review);
    const reviews = new review(req.body.Review);
    console.log(reviews)
    campground.reviews.push(reviews);
    await reviews.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;