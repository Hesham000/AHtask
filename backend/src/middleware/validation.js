const Joi = require('joi');
const { AppError } = require('./errorHandler');
const {HTTP_STATUS} = require('../utils/constants');

// PUUID validation schema
const puuidSchema = Joi.string()
.min(50)
.max(100)
.pattern(/^[a-zA-Z0-9_-]+$/)
.required()
.messages({
    'string.min': 'PUUID must be at least 50 characters long',
    'string.max': 'PUUID must be less than 100 characters',
    'string.pattern.base': 'PUUID must contain invalid characters',
    'any.required': 'PUUID is required'
})

// Validate PUUID
const validatePuuid = (req, res, next) => {
    const { puuid } = req.params;
    const { error } = puuidSchema.validate(puuid)
    if (error){
        return next(new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST));
    }
    next();
}

// Validate alot PUUIDs for comparison
const validatePuuidComparison = (req, res, next) => {
    const { puuid1, puuid2 } = req.params;

    const schema = Joi.object({
        puuid1: puuidSchema,
        puuid2: puuidSchema
    })
    const { error } = schema.validate({ puuid1, puuid2 })
    if (error) return next(new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST));
    if(puuid1 === puuid2) return next(new AppError('Cannot compare a player with himself', HTTP_STATUS.BAD_REQUEST));
    next();
}

// request validation middleware
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const {error} = schema.validate(req[property]);

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(errorMessage, HTTP_STATUS.BAD_REQUEST));
        }
        next();
    }
}

module.exports = {
    validatePuuid,
    validatePuuidComparison,
    validate,
    schema: {
        puuidSchema
    }
}