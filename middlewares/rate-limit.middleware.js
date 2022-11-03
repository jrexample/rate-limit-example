const redisClient = require('../redis');

const rateLimit = (limit, expireTime) => async (
  req,
  res,
  next,
) => {
  const key = `RATE_LIMIT_${req.route.path}`;

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

module.exports = rateLimit;
