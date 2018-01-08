// For the sake of brevity we will have all the routes in the api.js file under the /api namespace

import { Router } from 'express';
import client from '../client';
var apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.send("Hello World");
})

export default apiRouter;
