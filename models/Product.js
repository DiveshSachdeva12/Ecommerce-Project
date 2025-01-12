const mongoose = require("mongoose");
const producSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true
    },
    img:{
        type:String,
        trim:true,
    },
    price:{
        type:Number,
        min:0,
        require:true
    },
    desc:{
        type:String,
        trim:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
 
producSchema.post('findOneAndDelete',(product)=>{
    if(product.reviews.length>0){ 
         Review.deleteMany({_id:{$in:product.reviews}})
    }
})

let Product = mongoose.model('Product', producSchema)
module.exports= Product;