
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

//handeling uncaught exception
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception at:', err.name, err.message)
    process.exit(1)
})

const app = require('./app')

console.log(process.env)
// connect to remote db

mongoose.connect(process.env.CONNECTION_STR, {
    useNewUrlParser: true
}).then((conn)=>{
  console.log("DB connection is successsful");
  
}).catch((err)=> console.log(err))


// 1. create a server
const port = process.env.port || 3000
const server = app.listen(port, () => {
    console.log("Server is running on port 3000")
})

// handeling rejected promises
process.on('unhandledRejection', (err) =>{
    console.error('Unhandled Rejection at:', err.name, err.message)
    server.close(()=>{
      process.exit(1)
    })
})
