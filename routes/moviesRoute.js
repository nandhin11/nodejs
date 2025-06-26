const express = require("express")
const moviesController = require('./../controllers/moviesController')


////// ---------- use single function for route handlers -------- /////
// app.use('/api/v1/movies')
//     .get(getAllMovies)
//     .post(createMovie)
// app.use('/api/v1/movies/:id')
//    .get(getMovieById)
//    .patch(patchMovie)
//    .delete(deleteMovie)

////// ---------- use express router  -------- /////
const router = express.Router(); //router middleware

//router.param('id',moviesController.checkId)

router.route('/top').get(moviesController.aliasTopMovies)
router.route('/get-stats').get(moviesController.getAllMovieStats)

router.route('/')
           .get(moviesController.getAllMovies)
           .post(moviesController.createMovie)
          //.post(moviesController.isValidBody, moviesController.createMovie)
router.route('/:id')
           .get(moviesController.getMovieById)
           .patch(moviesController.patchMovie)
           .delete(moviesController.deleteMovie)
           

module.exports = router