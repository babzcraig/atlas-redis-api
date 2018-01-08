// For the sake of brevity we will have all the routes in the api.js file under the /api namespace
import { Router } from 'express';
import { getUser, getUsers, createUser, editUser, deleteUser } from './controllers';
var apiRouter = Router();


apiRouter.get('/', (req, res) => {
  // Set the famous "Hello World!" to the base /api route :-)
  res.send("Hello World");
});

// Get all Users
apiRouter.get('/users', getUsers);
apiRouter.get('/users/:id', getUser);
apiRouter.post('/users', createUser);
apiRouter.put('/users/:id', editUser);
apiRouter.delete('/users/:id', deleteUser);

export default apiRouter;
