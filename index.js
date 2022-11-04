const express = require('express');
const rateLimitMiddleware = require('./middlewares/rate-limit.middleware');
const redisClient = require('./redis');
const app = express();
const port = process.env.PORT || 3000;

const ONE_MINUTE = 60;

(async () => {
  await redisClient.connect();

  app.get('/', rateLimitMiddleware(10, ONE_MINUTE), (req, res) => {
    res.json({
      message: 'Hello World',
    });
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
