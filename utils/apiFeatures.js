exports.ApiFeatures = class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
   
   filter(){
       //const movies = await Movie.find();  // all movies

       /******************************************************/
       //   const movies = await Movie.find(req.query); /// pass query string and filter the object based on that mongoose 7.0
       const queryObject = {};
       const exclude = ['sort', 'fields', 'limit', 'page'];
       Object.keys(this.queryStr).forEach(key => {

           if (exclude.includes(key)) return;
           if (key.includes('[')) {
               const [field, operator] = key.split(/\[|\]/); // e.g. 'duration[gte]' -> ['duration', 'gte']
               queryObject[field] = { [`$${operator}`]: Number(this.queryStr[key]) };
           } else {
               queryObject[key] = this.queryStr[key];
           }
       });
       this.query = this.query.find(queryObject);
       return this;
   }
   sort(){
       // SORTING - 127.0.0.1:3000/api/v1/movies/?sort=-releaseYear, ratings
       if (this.queryStr.sort) {
           const sortBy = this.queryStr.sort.split(',').join(' ')
           this.query = this.query.sort(sortBy)
       }
       // else{
       //     query = query.sort('created_at')  --> commenting it coz it breaks pagination
       // }
       return this;
   }
   limitFields(){
       // LIMITING FIELDS - 127.0.0.1:3000/api/v1/movies/?fields=-releaseYear, -ratings (or) releaseYear,ratings
       if (this.queryStr.fields) {
           const fields = this.queryStr.fields.split(',').join(' ')
           this.query = this.query.select(fields)
           console.log(fields);
       }
       else {
           this.query = this.query.select('-__v')
       }
       return this;
   }
   paginate(){
       //PAGINATION - 127.0.0.1:3000/api/v1/movies/?page=1&limit=10
       const page = parseInt(this.queryStr.page) || 1;
       const limit = parseInt(this.queryStr.limit) || 10;
       const skip = (page - 1) * limit;
       this.query = this.query.skip(skip).limit(limit);
       return this;
   }
}
