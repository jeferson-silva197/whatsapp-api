// validateApiKey.js
const validateApiKey = (req, res, next) => {
    const apiKey = req.get('api-key');
  
    if (!apiKey || apiKey !== process.env.SECRETKEY) {
      return res.status(401).json({
        status: false,
        message: 'Chave de API inválida',
      });
    }
  
    next();
  };
  
  module.exports = validateApiKey;