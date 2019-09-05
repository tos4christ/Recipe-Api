const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

mongoose.connect('mongodb+srv://tos4christ:bQga6NwAlnyZkePT@cluster0-40r87.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to MongoDb Atlas');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas');
    console.error(error);
  });

// Allow cross-origin access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// parse the body contents and make it available on the req object
app.use(bodyParser.json());

// GET /api/recipes - returns all recipes in database
app.get('/api/recipes', (req, res, next) => {
  Recipe.find()
    .then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
});
  
// GET /api/recipes/:id - return the recipe with the provided ID from the database
app.get('/api/recipes/:id', (req, res, next) => {
  Recipe.findOne({_id: req.params.id})
    .then((recipe) => {
      res.status(200).json(recipe);
    });
});

// POST /api/recipes - adds a new recipe to the database
app.post('/api/recipes', (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  recipe.save()
    .then(() => {
      res.status(201).json({
        message: 'Recipe created successfully'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
});

// PUT /api/recipes/:id - modifies the recipe with the provided ID
app.put('/api/recipes/:id', (req, res, next) => {
  const newRecipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  Recipe.updateOne({_id: req.params.id}, newRecipe)
    .then(() => {
      res.status(201).json({
        message: 'Thing updated successfully'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

// DELETE /api/recipes/:id - deletes the recipe with the prvided ID
app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({_id: req.params.id})
    .then(() => {
      res.status(201).json({
        message: 'Recipe deleted successfully'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = app;