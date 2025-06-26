//Import package
const express = require("express")
const morgan = require('morgan') //third party middleware
const moviesRouter = require('./routes/moviesRoute') // import movies router
const authRouter = require('./routes/authRoute') // import auth router
const customError = require('./utils/customError')
const globalError = require('./controllers/errorController')

let app = express()

function logger(req, res, next) { // custom middleware - middleware is used to manipulate req and res
  console.log("custom middleware called and Request received");
  next()
}
app.use(express.json()); //middleware
if (process.env.NODE_ENV == 'development') { //using env variable
  app.use(morgan('dev')) // third party middleware
}
app.use(logger); //use middleware
app.use((req, res, next) => { // custom middleware
  req.requestedAt = new Date().toISOString();
  next()
})
app.use(express.static('./public')) //serving static files
//Router Handler
app.use('/api/v1/movies', moviesRouter) // mounting the router
app.use('/api/v1/users', authRouter) // mounting the router
//fallback route/ default route
app.use((req, res,next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
    // const err = new Error(`Can't find ${req.originalUrl} on this server!!`) 
    // err.status = "fail"
    // err.statusCode = 404
    
  const err = new customError(`Can't find ${req.originalUrl} on this server!!`,404)
   next(err)
});

//global error
app.use(globalError)

// 1. exports app
module.exports = app; //export app


