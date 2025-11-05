exports.verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey)
    return res.status(401).json({ error: 'Missing API key in headers' });

  // TODO: verify with Accounts service
  req.projectId = req.params.projectId;
  next();
};
