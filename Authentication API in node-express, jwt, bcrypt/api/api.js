var express = require('express');
var User = require('./model/user');
var jwt = require('jsonwebtoken');
var superSecret = "'karnav6868'";

module.exports = function(app, express) {

  var api = express.Router();
    api.post('/signup',function(req, res){
        if(!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname ){
            res.json({ success: false, message: 'please enter valid credentials'});
        } else {
            var user = new User ({
                email: req.body.email,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            });
                 user.save(function (err) {
                    if(err){
                         return res.json((err),{success: false, message: 'user already exist'});
                    }else{
                        var token =jwt.sign(user, superSecret,{
                            expiresInMinutes:1440 //expires in 24 hours
                        });
                        res.json({success: true, message: 'user has been created',  token: token});
                    }
                 });
        }
    });
    api.get('/users', function(req, res) {
        User.find({}, function(err, users) {
          res.json(users);
        });
    });

    api.post('/login', function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if(err) throw err;
            if(!user){
                res.send({success: false, message: 'Authentication Failed. User not Found'});
            }else if(user){

                if(user){
                    var validPassword = user.comparePassword(req.body.password)
                    if(!validPassword){
                        res.json({ success: false, message:'Authentication failed. Wrong Password ' + err });
                    }else {
                        var token = jwt.sign(user, superSecret, {
                            expiresInMinutes:1440 //expires in 24 hours
                        });
                        res.json({ success: true, message: 'successfully login', token: token});
                    }
                }
            }
        })
    });
    // route middleware to verify a token
    api.use(function (req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if(token){
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {
                if(err){
                    return res.json({success: false, message:'Failed to authenticate user'});
                }else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        }else {
            // if there is no token
            // return an error
            return res.status(403).send({success: false, message: 'no token provided.'});
        }
    });

    // Destination B // provide a logitimate token // or after login


    api.get('/me', function(req, res) {
       $location.path('/');
    });

    return api;
  };
