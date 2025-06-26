
const mongoose = require('mongoose')
const fs = require('fs')
const Movie=require('./../models/movieModel')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})


mongoose.connect(process.env.CONNECTION_STR, {

}).then((conn)=>{
  console.log("DB connection is successsful");
  
}).catch((err)=> console.log(err))

const movies = JSON.parse(fs.readFileSync('./data/movies.json','utf-8'))

//import movies
const importMovies = async()=>{
    try{
        await Movie.create(movies)
    }
    catch(err){
        console.log(err);
        
    }
}
//delete movies
const deleteMovies = async()=>{
    try{
        await Movie.deleteMany()
    }
    catch(err){
        console.log(err);
        
    }
}

if (process.argv[2] === '--import') {
    importMovies().then(() => process.exit());
} else if (process.argv[2] === '--delete') {
    deleteMovies().then(() => process.exit());
}

