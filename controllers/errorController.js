const CustomError = require("../utils/customError");

const devErrors = (res,error)=>{
res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stackTrace:error.stack,

});
}
const ProdErrors = (res,error)=>{
if (error.isOperational){
res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    name: error.name,
   
});
}
else{
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong! Please try again later',

    });
}
}

const castErrorhandler = (err) => {
    const msg = `Invalid movie ID: ${err.value}`;
    return new CustomError(msg, 400); // use your CustomError class
};
const duplicateErrorhandler = (err) => {
    const msg = `The movie ${err.keyValue.name} is already present`;
    return new CustomError(msg, 400); // use your CustomError class
};
const validationErrorhandler = (err) => {
    const errors = Object.values(err.errors).map(val=>val.message)
    const msg = `Invalid input data: ${errors.join('. ')}`;
    return new CustomError(msg, 400); // use your CustomError class
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        console.log('err',error);
        
        // CastError: invalid MongoDB ObjectId
        if (error.name === 'CastError') error = castErrorhandler(error);
        if (error.name === 'ValidationError') error = validationErrorhandler(error);
        if (error.code === 11000) error = duplicateErrorhandler(error);
        ProdErrors(res, error);
    }
};
