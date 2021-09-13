const express = require('express');
const User = require('../models/user');
const passport = require('passport'); // import passport
const authenticate = require('../authenticate'); // our authentication file

const router = express.Router();

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find() // mongoose queries mongodb for all User documents
  .then(users => { // promise catch return
    res.statusCode = 200; 
    res.setHeader('Content-Type', 'application/json');
    res.json(users); // ends response and sends to client
  })
  .catch(err => next(err)); // catches errs and passes them to express next func
});

//after the user goes to our endpoint www.susers/signup.com) the server registered the user using 
// a passport Strategy called register which grabs the username and password from the body (HTML forms)
router.post('/signup', (req, res) => {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        // when modifying a doc that has default values must use save method from mongoose
        user.save(err => { // mongoose method to save the user if they provide a first 
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
          // passport want you to implement this function to verify user after registering
          // grabs the username password  == authenticate('local)
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success:true, status: 'Registration Successful!'});
          });
        });
      }
    }
  );
});

// 1st arg endpoint (www.users/login.com)
// 2nd arg middleware passport.authenticate('local) == grabs the username and password from the req.body
// 3rd arg callback function to verify the jwt token
router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id}); // req user is coming from either passport authenticate local or exports.verifyuser
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
})

module.exports = router;
