const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are errors, send a 400 Bad Request response with the errors
    // We format the response to be consistent with our errorHandler
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  // If there are no errors, proceed to the next middleware (the controller)
  next();
};

module.exports = { handleValidationErrors };