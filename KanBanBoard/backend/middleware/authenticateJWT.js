const jwt = require('jsonwebtoken');

/**
 * Middleware that verifies the presence and validity of a JSON Web Token (JWT).
 * 
 * - Checks for a token in the `Authorization` header (format: "Bearer <token>").
 * - If valid, attaches the decoded user payload to `req.user` and proceeds to the next middleware.
 * - If missing or invalid, responds with 401 (Unauthorized) or 403 (Forbidden).
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` middleware function.
 */
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check if there is a token 
  if (authHeader) {
    // header is in the format "Bearer tokenString" (get tokenString)
    const token = authHeader.split(' ')[1];

    //check if token is valid
    jwt.verify(token,"KanbanSecretKey", (err, user) => {
      if (err) {
        return res.sendStatus(403); // handle expired or invalid token
      }

      // send the user information to the route
      req.user = user;
      next();
    });

  } else {
    res.sendStatus(401); // unauthorized if there is no token
  }
};
