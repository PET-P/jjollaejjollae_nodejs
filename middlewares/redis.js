const redis = require('redis');

const {REDIS_PORT} = process.env

const redisClient = redis.createClient(REDIS_PORT);

module.exports = redisClient