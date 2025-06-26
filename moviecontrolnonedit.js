const fs = require('fs')
const Movie = require('./../models/movieModel')



// Param middleware
exports.isValidBody = (req,res,next)=>{
 if(!req.body.name || !req.body.release_year){
    return res.status(400).json({
        status:"fail",
        message:"invalid request body"
        })
 }
 next();
}
//Create an aliasing middleware

exports.aliasTopMovies = async (req, res) => {
    try {
        const movies = await Movie.find()
            .sort('-rating')    // highest rated first
            .limit(2)           // top 2 movies
            .select('-__v');    // remove internal fields if desired

        res.status(200).json({
            status: 'success',
            results: movies.length,
            data: { movies },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};



exports.getAllMovies = async(req, res) => {

    try{
        console.log('Query Params:', req.query);
        //const movies = await Movie.find();  // all movies

        /******************************************************/
        //   const movies = await Movie.find(req.query); /// pass query string and filter the object based on that mongoose 7.0
        const queryObject = {};
        const exclude = ['sort', 'fields', 'limit', 'page'];
        Object.keys(req.query).forEach(key => {
            
            if (exclude.includes(key)) return;
            if (key.includes('[')) {
                const [field, operator] = key.split(/\[|\]/); // e.g. 'duration[gte]' -> ['duration', 'gte']
                queryObject[field] = { [`$${operator}`]: Number(req.query[key]) };
            } else {
                queryObject[key] = req.query[key];
            }
        });


        let query =  Movie.find(queryObject);
        // SORTING - 127.0.0.1:3000/api/v1/movies/?sort=-releaseYear, ratings
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        }
        // else{
        //     query = query.sort('created_at')  --> commenting it coz it breaks pagination
        // }
        // LIMITING FIELDS - 127.0.0.1:3000/api/v1/movies/?fields=-releaseYear, -ratings (or) releaseYear,ratings
           if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
            console.log(fields);
            }
            else{
            query = query.select('-__v')
            }
          
         //PAGINATION - 127.0.0.1:3000/api/v1/movies/?page=1&limit=10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);


        const movies = await query


    /************************************************************ */

       // query string method mongoose 6.0 or less
        // const exclude = ['sort','page','fields','limit']
        // const queryObj = {...req.query}
        // exclude.forEach(el=>
        //     delete queryObj[el]
        //     )
        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, match => `$${match}`);
        // const queryObject = JSON.parse(queryStr)
        

        // const movies = await Movie.find(queryObject)
        //const movies = await Movie.find(queryObj);

        res.status(200).json({
            status: "success",
            results: movies.length,
            data: {movies}
        })
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message
        }) 
    }

}

// GET - api/v1/movies/:id  ==> handeling route params
exports.getMovieById = async(req, res) => {
  try{
        // const movie = await Movie.find({_id:req.params.id})
        const movie = await Movie.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data: {movie}
        })
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message
        }) 
    }
}

// POST - api/v1/movies

exports.createMovie = async (req,res)=>{
    try{
        const newMovie = await Movie.create(req.body)
        res.status(201).json({
            status:"success",
            data:{newMovie}
            })
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
            })
    }
}

// Patch - api/v1/movies/:id
exports.patchMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).json({
            status: "success",
            data: { movie }
       })
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
            })
    }
  
}

// Delete - api/v1/movies/:id
exports.deleteMovie = async (req, res) => {
   try {
     await Movie.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "success",
            data:null
       })
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
            })
    }
}
 

// // ROUTE -- HTTP Method + url
// let movies = JSON.parse(fs.readFileSync('./data/movies.json'))

// // Param middleware

// exports.checkId = (req,res,next,value) => {
//    console.log('the id of the movie is ' + value);
    
//   const movie = movies.find((movie) => movie.id === value*1)
//    if(!movie){
//     return res.status(404).json({
//         status:"fail",
//         message:"movie not found"
//         })
//     }
//     next();
// }

// exports.isValidBody = (req,res,next)=>{
//  if(!req.body.name || !req.body.release_year){
//     return res.status(400).json({
//         status:"fail",
//         message:"invalid request body"
//         })
//  }
//  next();
// }

// // GET - api/v1/movies
// // app.get("/api/v1/movies", (req, res) => {
// //    // res.send('movies are listed')
// //     res.status(200).json({
// //         status:"success",
// //         requestedAt:req.requestedAt,
// //         count:movies.length,
// //         data:{
// //             movies: movies
// //         }
// //     })
// // })

// exports.getAllMovies = (req, res) => {
//    // res.send('movies are listed')
//     res.status(200).json({
//         status:"success",
//         requestedAt:req.requestedAt,
//         count:movies.length,
//         data:{
//             movies: movies
//         }
//     })
// }

// // GET - api/v1/movies/:id  ==> handeling route params
// exports.getMovieById = (req, res) => {
//    // res.send('movies are listed')
//    const id = req.params.id
//    const movie = movies.find((movie) => movie.id === parseInt(id))
// //    if(!movie){
// //     return res.status(404).json({
// //         status:"fail",
// //         message:"movie not found"
// //         })
// //     }
//      res.status(200).json({
//         status:"success",
//         data:{
//             movie: movie
//         }
//     })
// }

// // POST - api/v1/movies

// exports.createMovie = (req,res)=>{
//   const newId = movies[movies.length-1].id + 1
//   const newMovie = {
//     id:newId,
//     ...req.body
//   }
//   movies.push(newMovie)
//   fs.writeFile('./data/movies.json',JSON.stringify(movies),(err,data)=>{
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ status: "error", message: "Could not save movie." });
//     }
//     res.status(201).json({
//     status:"success",
//     movie:newMovie
//    })
//   })
// }

// // Patch - api/v1/movies/:id
// exports.patchMovie = (req, res) => {
//     const id = req.params.id
//    const movieToUpdate = movies.find((movie) => movie.id === parseInt(id))
// //     if(!movieToUpdate){
// //     return res.status(404).json({
// //         status:"fail",
// //         message:"movie not found"
// //     })
// //  }
//     let index = movies.indexOf(movieToUpdate)        
//     const updatedMovie = {...movieToUpdate, ...req.body}
//     movies[index] = updatedMovie
//     fs.writeFile('./data/movies.json',JSON.stringify(movies),(err,data)=>{
//         if (err) { return res.status(500).json({ status: "error", message: "Could not update movie." });}
//         res.status(200).json({
//               status:"success",
//               movie:updatedMovie
//             })
//        })
//    }

// // Delete - api/v1/movies/:id
// exports.deleteMovie = (req, res) => {
//     const id = req.params.id
//      const movieToDelete = movies.find((movie) => movie.id === parseInt(id))
//     // if(!movieToDelete){
//     //   return res.status(404).json({
//     //     status:"fail",
//     //     message:"movie not found"
//     //     })
//     // }
//     let index = movies.indexOf(movieToDelete)
//     movies.splice(index,1)
//     fs.writeFile('./data/movies.json',JSON.stringify(movies),(err,data)=>{
//         if (err) { 
//             return res.status(500).json({ status: "error", message})
//         }
//         res.status(204).json({ status: "success", message: "Movie deleted successfully."
//         })
//     })
// }
 