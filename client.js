import redis from 'redis';


// Set up redis with our preferred options
var client = redis.createClient({
  host : 'localhost' || process.env.REDIS_HOST,
  port : 6379 || process.env.REDIS_PORT
});

export default client;
