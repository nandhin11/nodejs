const mongoose = require("mongoose");
const fs = require('fs')

// create a schema
const moviesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            maxLength: [100, "length of the movie name should not be more than 100"],
            minLength: [4, "length of the movie name should not be less than 4"],
            unique: true,
        },
        description: {
            type: String,
            required: [true, "description is required"],
        },
        release_year: {
            type: Number,
            required: [true, "release year is required"],
        },
        rating: {
            type: Number,
            //  min:[1,"rating should be more than 0"],
            //  max:[10,"rating should not be more than 10"]
            //custom validator
            validate: {
                validator: function (value) {
                    return value >= 1 && value <= 10
                },
                message: props =>
                    `Rating should be between 1 and 10`,
            }
        },
        genre: {
            type: String,
            required: [true, "genre is required"],
        },
        director: {
            type: String,
            required: [true, "director is required"],
        },
        duration: {
            type: Number,
            required: [true, "duration is required"],
        },
        language: {
            type: String,
        },
        isAvailableOnStreaming: {
            type: Boolean,
            default: false
        },
        cast: {
            type: [String],
            required: [true, "casts are required"],
        },
        image_url: {
            type: String,
            required: [true, "image is required"],
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        created_By: String
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

//Virtual properties
moviesSchema.virtual('durationInHours').get(function () {
    return (this.duration / 60).toFixed(2);
})
//document middleware
moviesSchema.pre('save', function (next) {
    this.created_By = "xiang"
    next();
})

moviesSchema.post('save', function (doc, next) {
    let content = `the file ${doc.name} is created by ${doc.created_By}\n`
    fs.writeFileSync('./log/log.txt', content, { flag: 'a' }, (err) => {
        if (err) console.log(err)
    })
    next()
})

// query middleware
moviesSchema.pre(/^find/, function (next) {
    this.find({ isAvailableOnStreaming: true })
    this.startTime = Date.now()
    next()
})
moviesSchema.post(/^find/, function (docs, next) {
    let content = `Query took ${Date.now() - this.startTime} milliseconds\n`
    fs.writeFileSync('./log/log.txt', content, { flag: 'a' }, (err) => {
        if (err) console.log(err)
    })
    next()
})

//aggregate middleware
moviesSchema.pre('aggregate', function (next) {
    this.pipeline({
        $match: {
            isAvailableOnStreaming: true
        }
    })
    next()
})

//create a model
const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;

//create a collection
//insert a document
// const testMovie = new Movie({
//     "name":"Forrest Gump",
//     "release_year":1998,
//     "rating":8.7
// })
// testMovie.save().then((doc)=>{
//     console.log("Movie saved",doc)
// }).catch((err)=>{
//    console.log(err);

// })
