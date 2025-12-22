import Joi from 'joi';

/**
 * Validate coordinates
 */
export const validateCoordinates = (data) => {
  const schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required()
      .messages({
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90',
        'any.required': 'Latitude is required'
      }),
    lng: Joi.number().min(-180).max(180).required()
      .messages({
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180',
        'any.required': 'Longitude is required'
      })
  });

  return schema.validate(data);
};

/**
 * Validate city name
 */
export const validateCity = (city) => {
  const schema = Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'City name must be at least 2 characters',
      'string.max': 'City name must not exceed 100 characters',
      'any.required': 'City name is required'
    });

  return schema.validate(city);
};

/**
 * Validate address
 */
export const validateAddress = (address) => {
  const schema = Joi.string().min(5).max(200).required()
    .messages({
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address must not exceed 200 characters',
      'any.required': 'Address is required'
    });

  return schema.validate(address);
};

/**
 * Validate date
 */
export const validateDate = (date) => {
  const schema = Joi.date().iso().required()
    .messages({
      'date.format': 'Date must be in ISO format',
      'any.required': 'Date is required'
    });

  return schema.validate(date);
};

/**
 * Validate radius
 */
export const validateRadius = (radius) => {
  const schema = Joi.number().min(100).max(50000).required()
    .messages({
      'number.min': 'Radius must be at least 100 meters',
      'number.max': 'Radius must not exceed 50000 meters',
      'any.required': 'Radius is required'
    });

  return schema.validate(radius);
};