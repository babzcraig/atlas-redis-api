// For the sake of brevity we will have all the routes in the api.js file under the /api namespace
import { Router } from 'express';
import client from '../client';
var apiRouter = Router();

apiRouter.get('/', (req, res) => {
  // Set the famous "Hello World!" to the base /api route
  res.send("Hello World");
});

// Get all Users
apiRouter.get('/users', (req, res) => {
  var users = [];
  client.smembers(`user:index`, (err, keys) => {
    if (err) return console.log(err);
    keys.map((key, i, arr) => {
      client.hgetall(key, (err, user) => {
        if (err) return console.log(err);
        users.push(user);
        if (arr.length-1 === i) res.send(users);
      });
    });
  });
});

// Get a User
apiRouter.get('/users/:id', (req, res, next) => {
  const { id } = req.params;

  client.hgetall(`user:${id}`, (err, user) => {
    if (!user) {
      res.send(404, { message: 'The user could not be found' });
    } else {
      res.send(user);
    }
  });
});

// Create a User
apiRouter.post('/users', (req, res) => {
  // We use the user:id key to set an id for our users in sequence
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
        res.send({ message: 'User saved successfully!' });
      });
    });
  });
});

// Edit a User
apiRouter.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const key = `user:${id}`;
  const updatedFields = req.body;

  let values = [];
  Object.keys(updatedFields).map(k => {
    values.push(k, updatedFields[k]);
  });
  client.hmset(key, values, (err, reply) => {
    if (err) return console.log(err);
    res.send({ message: 'User updated successfully!'});
  });
});

// Delete a User
apiRouter.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const key = `user:${id}`;
  client.del(key, (err, reply) => {
    if (err) return console.log(err);
    // Remove the index as well
    client.srem(`user:index`, key, (err, reply) => {
      if (err) return console.log(err);
      res.send({ message: 'User deleted successfully!'});
    });
  });
});

export default apiRouter;
