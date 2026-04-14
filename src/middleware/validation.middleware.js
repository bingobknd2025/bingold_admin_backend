// middleware/validation.middleware.js
const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
    return (req, res, next) => {
        // Determine what to validate based on schema structure
        const validationTargets = [];

        if (schema.params) validationTargets.push({ source: 'params', data: req.params });
        if (schema.query) validationTargets.push({ source: 'query', data: req.query });
        if (schema.body) validationTargets.push({ source: 'body', data: req.body });

        // If no specific targets defined, validate the whole request body
        if (validationTargets.length === 0) {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(d => d.message)
                });
            }
            return next();
        }

        // Validate each target
        for (const { source, data } of validationTargets) {
            const { error } = schema[source] ? schema[source].validate(data) : { error: null };
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: `Validation error in ${source}`,
                    errors: error.details.map(d => d.message)
                });
            }
        }

        next();
    };
};

module.exports = validate;