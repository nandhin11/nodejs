const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Name is required']
  },
  email:{
    type:String,
    required:[true,'Email is required'],
    unique:true,
    lowerCase:true,
    validate:[validator.isEmail,'Please enter valid email']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength:[8,'Password must be at least 8 characters']
        },
    confirmPassword:{
        type:String,
        required:[true,'Confirm Password is required'],
        validate:{
        validator:function(val){
            return val === this.password
            },
            message:'Passwords do not match'
       }
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified

    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined; // Don't store confirmPassword in DB
    next(); // Call next middleware
});
  
const User = mongoose.model("User",userSchema);
module.exports = User