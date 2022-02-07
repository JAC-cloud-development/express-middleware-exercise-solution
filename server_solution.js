import _ from 'lodash';
import express from 'express';
import cors from 'cors';

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors())

app.locals.pets = [
  { name: 'Lassie', type: 'dog' },
  { name: 'Felix', type: 'cat' },
  { name: 'Garfield', type: 'cat' },
  { name: 'Peter', type: 'rabbit' }
];


// Create middleware functions here ------------------------------------->

// 0. Add for every route the built-in module json (express.json())
app.use(express.json());


// 1. First middleware function (apply this function to all endpoints)
// Log data about the request:
// HTTP verb (req.method), endpoint (req.path), data in the request body (req.body), and anything else!


app.use((req, res, next) => {
  console.log(req.method, req.path, req.body)
  next();
})

// 2. Second middleware function (apply to only endpoint POST /pets)
// Check that there has been information sent in the request body (_.isEmpty(req.body))
// If there is a request body, continue to POST request handler
// If there is not data in the request body, do not continue and send 422 response

const checkBody = (req, res, next) => {
  if (_.isEmpty(req.body)) {
    res.sendStatus(422);
  } else {
    next();
  }
}


// 3. Third middleware function (apply to only endpoint POST /pets)
// Check that the content-type is application/json (req.get('Content-Type'))
// If the content-type is correct, continue to the next middleware
// If the content-type is incorrect, do not continue and send 400 response

const checkContentType = (req, res, next) => {
  if (req.get('Content-Type') === 'application/json') {
    next();
  } else {
    res.sendStatus(400);
  }
}


  // ---------------------------------------------------------------------->




  app.post('/api/v1/pets', checkBody, checkContentType, (request, response) => {
    const pet = request.body;

    for (let requiredParameter of ['name', 'type']) {
      if (!pet[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` });
      }
    }

    const { name, type } = pet;
    app.locals.pets.push({ name, type });
    response.status(201).json({ name, type });

  });


app.get('/api/v1/pets', (request, response) => {
  response.status(200).json(app.locals.pets);
});




app.listen(app.get('port'), () => {
  console.log(`Middleware exercise server running on http://localhost:${app.get('port')}`);
});