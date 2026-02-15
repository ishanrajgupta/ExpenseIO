const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400);
    const error = new Error('Validation failed');
    error.errors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    throw error;
  }
  
  next();
};

module.exports = validate;
