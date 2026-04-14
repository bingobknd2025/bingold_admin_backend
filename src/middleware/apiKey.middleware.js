module.exports = (req, res, next) => {
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
