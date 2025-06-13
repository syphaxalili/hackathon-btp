function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function errorResponse(res, message, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
}

function notFoundResponse(res, resource = 'Resource') {
  return this.errorResponse(res, `${resource} not found`, 404);
}

function validationErrorResponse(res, errors) {
  return res.status(400).json({
    success: false,
    error: 'Validation Error',
    errors
  });
}

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse
};
