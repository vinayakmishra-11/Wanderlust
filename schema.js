const Joi = require('joi');


module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
  url: Joi.string().allow('').optional(), // <-- allow empty string
  filename: Joi.string().allow('').optional()
}).optional(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});


module.exports.reviewSchema=Joi.object({
    Reviews : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
})