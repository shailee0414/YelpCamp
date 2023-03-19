module.exports=catchAsync=>{
    return function(req,res,next){
        catchAsync(req,res, next).catch(next)
    }
}