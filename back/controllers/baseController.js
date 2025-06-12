// Base controller with common functionality that can be extended by other controllers
class BaseController {
  static successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data
    });
  }

  static errorResponse(res, message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  }

  static notFoundResponse(res, resource = 'Resource') {
    return this.errorResponse(res, `${resource} not found`, 404);
  }

  static validationErrorResponse(res, errors) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      errors
    });
  }
}

module.exports = BaseController;
