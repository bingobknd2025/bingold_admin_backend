module.exports = (req, res, next) => {
  // Never gate CORS preflight requests. Browsers send OPTIONS without the
  // x-api-key header, so requiring it here returns 401 and the real request
  // (POST/GET) is never sent. Let the preflight through to the cors handler.
  if (req.method === 'OPTIONS') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing API key'
    });
  }
  if (apiKey !== process.env.PDA_API_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Incorrect API key'
    });
  }

  next();
};
