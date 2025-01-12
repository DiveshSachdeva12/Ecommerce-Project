// schema for server side validation
const Joi = require('joi');

const ProductSchema = Joi.object({
    name: Joi.string().required(),
    img:Joi.string().required(),
    price:Joi.string().min(0).required(),
    desc:Joi.string().required()

})
const reviewSchema = Joi.object({
    rating: Joi.string().max(5).required(),
    comment: Joi.string().required()
    
})

module.exports={ProductSchema,reviewSchema}