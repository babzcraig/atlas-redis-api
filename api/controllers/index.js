import client from '../../client';
// We either run with the default '0' or set to whatever we have stored in our ENV variable
const redisdb =  process.env.REDIS_DB || 0;

module.exports = {
  getUsers: (req, res) => {
    var users = [];
    client.select(redisdb, (err, reply) => {
      client.smembers(`user:index`, (err, keys) => {
        if (err) return console.log(err);
        // We return an empty array since we have no users
        if (keys.length === 0) return res.json(keys);
        // If we find keys, then let's map and create an array of user hashes
        keys.map((key, i, arr) => {
          client.hgetall(key, (err, user) => {
            if (err) return console.log(err);
            users.push(user);
            if (arr.length-1 === i) res.json(users);
          });
        });
      });
    });
  },
  
  getUser: (req, res, next) => {
    const { id } = req.params;
    client.select(redisdb, (err, reply) => {
      client.hgetall(`user:${id}`, (err, user) => {
        if (!user) {
          res.json(404, { message: 'The user could not be found' });
        } else {
          res.json(user);
        }
      });
    });
  },

  createUser: (req, res) => {
    // We use the user:id key to set an id for our users in sequence
    client.select(redisdb, (err, reply) => {
      client.incr('user:id', (err, id) => {
        // We'll log to the console for brevity here. In app, we would handle the error
        // as decided as a team
        if (err) return console.log(err);
        // do some checking here for permited fields
    
        const { first_name, last_name, email, phone } = req.body;
        // We use the key = "user:userId" to set the user hash in redis
        const key = `user:${id}`;
        client.hmset(key, [
          'first_name', first_name,
          'last_name', last_name,
          'email', email,
          'id', id
        ], (err, reply) => {
          if (err) return console.log(err);
          // Store the saved user in our userIndex
          client.sadd('user:index', key, (err, reply) => {
            if (err) return console.log(err);
            res.json({ message: 'User saved successfully!' });
          });
        });
      });
    });
  },

  editUser: (req, res) => {
    const { id } = req.params;
    const key = `user:${id}`;
    const updatedFields = req.body;
  
    let values = [];
    Object.keys(updatedFields).map(k => {
      values.push(k, updatedFields[k]);
    });
    client.select(redisdb, (err, reply) => {
      client.hmset(key, values, (err, reply) => {
        if (err) return console.log(err);
        res.json({ message: 'User updated successfully!'});
      });
    });
  },

  deleteUser: (req, res) => {
    const { id } = req.params;
    const key = `user:${id}`;
    client.select(redisdb, (err, reply) => {
      client.del(key, (err, reply) => {
        if (err) return console.log(err);
        // Remove the index as well
        client.srem(`user:index`, key, (err, reply) => {
          if (err) return console.log(err);
          res.json({ message: 'User deleted successfully!'});
        });
      });
    });
  }
}