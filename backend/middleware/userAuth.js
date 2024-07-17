const jwt = require('jsonwebtoken');
const { User } = require('../db/Schema'); // Adjust the path as per your project structure

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
};

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("Authentication header is not correct")
    return res.status(403).json({
      message: "Authentication header is not correct"
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Token verification failed

    if (error.name === 'TokenExpiredError') {
      // Token has expired, try to refresh it
      console.log("oken has expired")
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        console.log("Refresh token is missing")
        return res.status(403).json({
          message: "Refresh token is missing"
        });
      }

      try {
        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const userExist = await User.findOne({ email: decodedRefreshToken.email });

        if (!userExist || userExist.refreshToken !== refreshToken) {
          console.log("Invalid refresh token")
          return res.status(403).json({
            message: "Invalid refresh token"
          });
        }

        const newToken = generateAccessToken(decodedRefreshToken.email);
        req.user = decodedRefreshToken;
        
        res.token = new newToken;
        next();
      } catch (refreshError) {
        console.log("Refresh token is invalid or expired")
        return res.status(403).json({
          message: "Refresh token is invalid or expired"
        });
      }
    } else {
      console.log("User is not authenticated")
      return res.status(411).json({
        message: "User is not authenticated"
      });
    }
  }
};

module.exports = userAuth;
