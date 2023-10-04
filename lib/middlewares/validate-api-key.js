// validateApiKey.js
const validateAccessToken = (req, res, next) => {
    const access_token = req.get('access_token');
  
    if (!access_token || access_token !== process.env.SECRETKEY) {
      return res.status(401).json({
        status: false,
        message: 'Access Token inválido!',
      });
    }
  
    next();
  };
  
  module.exports = validateAccessToken;