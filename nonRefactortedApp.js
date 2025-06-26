//Import package
const express = require("express")
const fs = require("fs")
const morgan = require('morgan') //third party middleware
let app = express()

app.use(express.json()); //middleware
app.use(morgan('dev')) // use third party middleware

function logger(req,res,next){ // custom middleware - middleware is used to manipulate req and res
    console.log("custom middleware called and Request received");
    next()
}
app.use(logger); //use middleware

app.use((req,res,next)=>{ // custom middleware
  req.requestedAt = new Date().toISOString();
  next()
})

// ROUTE -- HTTP Method + url

let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

// GET - api/v1/movies
// app.get("/api/v1/movies", (req, res) => {
//    // res.send('movies are listed')
//     res.status(200).json({
//         status:"success",
//         requestedAt:req.requestedAt,
//         count:movies.length,
//         data:{
//             movies: movies
//         }
//     })
// })

const getAllMovies = (req, res) => {
   // res.send('movies are listed')
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,
        count:movies.length,
        data:{
            movies: movies
        }
    })
}

// GET - api/v1/movies/:id  ==> handeling route params
const getMovieById = (req, res) => {
   // res.send('movies are listed')
   const id = req.params.id
   const movie = movies.find((movie) => movie.id === parseInt(id))
   if(!movie){
    return res.status(404).json({
        status:"fail",
        message:"movie not found"
        })
    }
     res.status(200).json({
        status:"success",
        data:{
            movie: movie
        }
    })
}

// POST - api/v1/movies

const createMovie = (req,res)=>{
  const newId = movies[movies.length-1].id + 1
  const newMovie = {
    id:newId,
    ...req.body
  }
  movies.push(newMovie)
  fs.writeFile('./data/movies.json',JSON.stringify(movies),(err,data)=>{
    if (err) {
      console.log(err);
      return res.status(500).json({ status: "error", message: "Could not save movie." });
    }
    res.status(201).json({
    status:"success",
    movie:newMovie
   })
  })
}

// Patch - api/v1/movies/:id
const patchMovie = (req, res) => {
    const id = req.params.id
    const movieToUpdate = movies.find((movie) => movie.id === parseInt(id))
    if(!movieToUpdate){
    return res.status(404).json({
        status:"fail",
        message:"movie not found"
    })
 }
    let index = movies.indexOf(movieToUpdate)        
    const updatedMovie = {...movieToUpdate, ...req.body}
    movies[index] = updatedMovie
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err,data)=>{
        if (err) { return res.status(500).json({ status: "error", message: "Could not update movie." });}
        res.status(200).json({
              status:"success",
              movie:updatedMovie
            })
       })
   }

// Delete - api/v1/movies/:id
const deleteMovie = (req, res) => {
    const id = req.params.id
    const movieToDelete = movies.find((movie) => movie.id === parseInt(id))
    if(!movieToDelete){
      return res.status(404).json({
        status:"fail",
        message:"movie not found"
        })
    }
    let index = movies.indexOf(movieToDelete)
    movies.splice(index,1)
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err,data)=>{
        if (err) { 
            return res.status(500).json({ status: "error", message})
        }
        res.status(204).json({ status: "success", message: "Movie deleted successfully."
        })
    })
}
 
////// ---------- use single function for route handlers -------- /////
// app.use('/api/v1/movies')
//     .get(getAllMovies)
//     .post(createMovie)
// app.use('/api/v1/movies/:id')
//    .get(getMovieById)
//    .patch(patchMovie)
//    .delete(deleteMovie)

////// ---------- use express router  -------- /////
const movieRouter = express.Router(); //router middleware
movieRouter.route('/')
           .get(getAllMovies)
           .post(createMovie)
movieRouter.route('/:id')
           .get(getMovieById)
           .patch(patchMovie)
           .delete(deleteMovie)
app.use('/api/v1/movies',movieRouter) // mount the router

// 1. create a server
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

