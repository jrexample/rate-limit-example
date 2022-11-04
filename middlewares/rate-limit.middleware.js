const redisClient = require('../redis');

const rateLimitMiddleware = (limit, expireTime) => async (
  req,
  res,
  next,
) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const key = `RATE_LIMIT_${ip}_${req.route.path}`;

  const current = await redisClient.incr(key);

  if (current > limit) {
    return res.status(429).json({
      message: 'Too Many Requests',
    });
  } else if (current === 1) {
    await redisClient.expire(key, expireTime);
  }

  return next();
}

module.exports = rateLimitMiddleware;
