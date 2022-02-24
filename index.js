// Load express framework
const express = require('express');
const app = express();

// Import middleware libraries: Morgan, body-parser, and uuid
const morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

// Log basic request data in terminal using Morgan middleware library
app.use(morgan('common'));

// Use body-parser middleware function
app.use(bodyParser.json());

// Create array of objects that holds data about movies
let movies = [
  {
    title: 'Titanic',
    genre: 'Drama',
    director: 'James Cameron'
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    genre: 'Fantasy',
    director: 'Chris Columbus'
  },
  {
    title: 'Guardians of the Galaxy',
    genre: 'Action',
    director: 'James Gunn'
  }
];

// Create array of objects that holds data about genres
let genres = [
  {
    genre_name: 'Drama',
    description: 'The drama genre features stories with high stakes and a lot of conflicts. They\'re plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters.'
  },
  {
    genre_name: 'Fantasy',
    description: 'Fantasy is a genre of literature that features magical and supernatural elements that do not exist in the real world. Speculative in nature, fantasy is not tied to reality or scientific fact.'
  },
  {
    genre_name: 'Action',
    description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
  }
];

// Create array of objects that holds data about directors
let directors = [
  {
    director_name: 'James Cameron',
    birth_year: 1954,
    bio: 'xyz'
  },
  {
    director_name: 'Chris Columbus',
    birth_year: 1958,
    bio: 'abc'
  },
  {
    direcor_name: 'James Gunn',
    birth_year: 1966,
    bio: 'def'
  }
];

// Create array of objects that holds data about users
let users = [];

// READ: Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ: Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  // Find the movie with the corresponding title
  let movie = movies.find((movie) => {
    return movie.title === req.params.title;
  });

  if(movie) { // If movie was found, return json, else throw error
    res.status(200).json(movie);
  } else {
    res.status(400).send('Movie not found');
  };
});

// READ: Return data about a genre (description) by name/title (e.g., “Fantasy”)
app.get('/genres/:genre_name', (req, res) => {
  // Find the genre with the corresponding genre name
  let genre = genres.find((genre) => {
    return genre.genre_name === req.params.genre_name;
  });

  if(genre){ // If genre was found, return json, else throw error
    res.status(200).json(genre);
  } else {
    res.status(400).send('Genre not found');
  };
});

// READ: Return data about a director (bio, birth year, death year) by name
app.get('/directors/:director_name', (req, res) => {
  // Find the director with the corresponding name
  let director = directors.find((director) => {
    return director.director_name === req.params.director_name;
  });

  if (director) { // If director was found, return json, else throw error
    res.status(200).json(director);
  } else {
    res.status(400).send('Director not found');
  };
});

// CREATE: Allow new users to register
app.post('/users', (req, res) => {
  let newUser = req.body; // using body-parser to get request body in JSON format

  if(!newUser.user_name){ // If the user_name is missing, return error message
    res.status(400).send('Missing user name in request body!');
  } else { // Create uuid and add new user to the user list
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send('Your profile with the user name ' + req.body.user_name + ' was successfully created!');
  };
});

// READ: Return a list of ALL users (only for testing purposes)
app.get('/users', (req, res) => {
  res.json(users);
});


// UPDATE: Allow users to update their user info (username)
app.put('/users/:email/:user_name', (req, res) => {
  // Find the user with the corresponding email
  let user = users.find((user) => {
    return user.email === req.params.email;
  });

  if(user){ // if a user could be found, change user name
    user.user_name = req.params.user_name;
    res.status(200).send('Your username was successfully updated to: ' + req.params.user_name);
  } else { // else, return error message
    res.status(400).send('User with mail address ' + req.params.email + ' was not found.');
  };
});

// CREATE: Allow users to add a movie to their list of favorites
app.post('/users/:email/favorites/:title', (req, res) => {
  // Find the user with the corresponding email
  let user = users.find((user) => {
    return user.email === req.params.email;
  });

  if(user){ // If a user with the email address exists
    if (!user.favorites) { // Check if user already has a list of favorites, if not, add element to user object
      user["favorites"] = [];
    };
    user.favorites.push(req.params.title); // Add title to list of favorites
    res.status(201).send('Movie with the title ' + req.params.title + ' was successfully added to your list of favorites!');
  } else { // If user cannot be found, return error
    res.status(404).send('User with the email ' + req.params.email + ' was not found.');
  };
});

// DELETE: Allow users to remove a movie from their list of favorites
app.delete('/users/:email/favorites/:title', (req, res) => {
  // Find the user with the corresponding email
  let user = users.find((user) => {
    return user.email === req.params.email;
  });

  if(user){ // If a user with the email address exists
    let index = user.favorites.indexOf(req.params.title);
    if (index > -1){
      user.favorites.splice(index, 1);
      res.status(200).send('Movie with the title ' + req.params.title + " was successfully deleted from your list.");
    } else {
      res.status(400).send('Movie not found in list of favorites.');
    }
  } else { // If user cannot be found, return error
    res.status(400).send('User with the email ' + req.params.email + ' was not found.');
  };
});

// DELETE: Allow existing users to deregister
app.delete('/users/:email', (req, res) => {
  // Find the user with the corresponding email
  let user = users.find((user) => {
    return user.email === req.params.email;
  });

  if (user) { // If a user with the email address exists
    // delete the user object from the array
    users = users.filter((obj) => {
      return obj.email != req.params.email;
    });
    // Send response message
    res.status(200).send('User with the email ' + req.params.email + ' was sucessfully deleted.');
  } else { // If user cannot be found, return error
    res.status(400).send('User with the email ' + req.params.email + ' was not found.');
  };
});

// GET Welcome message for '/' request URL
app.get('/', (req, res) => {
  res.send('Welcome to the myMovies App!');
});

// Serve static content for the app from the 'public' directory
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen to port 8080
const port = 8000;
app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
