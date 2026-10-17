function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  if (err.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(item => item.message);
    return res.status(400).json({ message: messages.join(" ") });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "The supplied ID is not valid." });
  }
  console.error(err);
  res.status(status).json({ message: err.message || "Something went wrong on the server." });
}

module.exports = { notFound, errorHandler };
