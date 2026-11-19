export const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
export const errorHandler = (err, _req, res, _next) => {
  if (err.code === 11000) err = { status: 409, message: 'Email already registered' };
  if (err.name === 'MulterError') err = { status: 400, message: err.message };
  if (res.headersSent) return res.end();
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};
