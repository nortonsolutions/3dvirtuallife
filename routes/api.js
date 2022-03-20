/*
* Norton 2021 - 3D virtual life
*
*/

'use strict';

var expect             = require('chai').expect;
var bcrypt             = require('bcrypt');
var passport           = require('passport');

module.exports = function (app, db) {

    // ensureAuthenticated
    const ensureAuthenticated = (req,res,next) => {
        if (req.isAuthenticated()) {
        return next();
        }
        res.redirect('/');
    };

    // ensureAdmin
    const ensureAdmin = (req,res,next) => {
        if (req.user.roles.includes('admin')) {
            next();
        } else {
            res.redirect('/main');
        }     
    };

    app.route('/')
        .get((req,res) => {
            var options = {
                welcomeMessage: "Welcome to Adventure!",
                showLogin: true
            }
            res.render(process.cwd() + '/views/index.hbs', options);
        })

    app.route('/save')
        .post(ensureAuthenticated, (req,res) => {
            let gameName = req.body.gameName;
            let savedBy = req.user.username;
            let heroTemplate = req.body.gameHeroTemplate;
            let props = req.body.gameProps;

            db.models.SavedGame.findOne({ gameName: gameName }, (err,savedGame) => {
                if (err) {
                   res.json({error: err.message});
                } else if (savedGame) { // game exists, overwrite
                    savedGame.heroTemplate = heroTemplate;
                    savedGame.savedBy = savedBy;
                    savedGame.props = props;
                    savedGame.save((err,savedGame) => {
                        res.json(err? {error: err.message} : {success: "saved"});
                    })
                } else { // new game
                    db.models.SavedGame.create({ 
                        gameName: gameName,
                        savedBy: savedBy,
                        heroTemplate: heroTemplate,
                        props: props
                    }, (err, doc) => {
                        res.json(err? {error: err.message} : {success: "saved"});
                    });
                }
            })
        })
    

    app.route('/delete')
        .post(ensureAuthenticated, (req,res) => {
            db.models.SavedGame.remove({_id: req.body.gameId}, (err,body) => {
                res.json(err? {error: err.message} : {success: "removed"});
            })
        })

    app.route('/list')
        .get(ensureAuthenticated, (req,res) => {
            db.models.SavedGame.find({ savedBy: req.user.username }, (err,savedGames) => {

                let listOfGames = savedGames.map(el => {
                    return {
                        gameName: el.gameName,
                        heroName: JSON.parse(el.heroTemplate).name,
                        level: JSON.parse(el.props).level
                    }
                })

                res.json(err? {error: err.message} : listOfGames);
            });
        })

    app.route('/load/:gameName')
        .get(ensureAuthenticated, (req,res) => {
            var gameName = req.params.gameName;
            db.models.SavedGame.findOne({ gameName: gameName }, (err,savedGame) => {
                res.json(err? {error: err.message} : savedGame);
            });
        })
    
    app.route('/listActiveGames')
        .get(ensureAuthenticated, (req,res) => {
            res.json(app.games);
        });

    app.route('/clearActiveGames')
        .get(ensureAuthenticated, ensureAdmin, (req,res) => {
            app.gameStarts = {}
            app.gameTimes = {};
            app.games = {};
            app.rooms = {}; 
            app.layouts = {};
            app.forms = {};
            
            res.json({});
        });


    app.route('/listSavedHeroes')
        .get(ensureAuthenticated, (req,res) => {
            db.models.SavedGame.find({ savedBy: req.user.username }, (err,savedGames) => {
                let listOfHeroes = savedGames.map(el => {
                    let heroTemplate = JSON.parse(el.heroTemplate);
                    heroTemplate.id = el._id;
                    return heroTemplate;
                });
                res.json(err? {error: err.message} : listOfHeroes);
            });
        });


    app.route('/login')
        // Login
        .post(passport.authenticate('local', { successRedirect: '/main', failureRedirect: '/?failedLogin=true' }))


    app.route('/register')
        // Register a new user
        .post(
        (req, res, next) => {
            db.models.User.findOne({ username: req.body.username }, function(
            err,
            user
            ) {
            if (err) {
                next(err);
            } else if (user) {
                res.redirect("/");
            } else {
                bcrypt.hash(req.body.password, 12).then(hash => {
                db.models.User.create(
                    { 
                    username: req.body.username, 
                    password: hash,
                    surname: req.body.surname,
                    firstname: req.body.firstname
                    },
                    (err, doc) => {
                    if (err) {
                        res.redirect("/");
                    } else {
                        next(null, user);
                    }
                    }
                );
                });
            }
            });
        },
        passport.authenticate("local", { failureRedirect: "/?failedLogin=true" }),
        (req, res, next) => {
            res.redirect("/main");
        }
        );

    app.route('/deleteAccount')
        .post(ensureAuthenticated, ensureAdmin, (req,res) => {
            db.models.User.remove({_id: req.body._id}, (err,body) => {
                res.json(err? {error: err.message} : {success: "removed"});
            })
        })

    app.route('/updateAccount')
        .post(ensureAuthenticated,(req,res) => {
        db.models.User.findOne({_id : req.body._id}, (err,user) => {
            if (err) {
                res.json({error: err.message});
            } else {

            if (req.body.password != req.body.confirm) {
                res.json({error: "Password and Confirm values must match."});
            } else {

                user.username = req.body.username;
                user.firstname = req.body.firstname;
                user.surname = req.body.surname;

                if (req.body.roles) {
                    user.roles = req.body.roles;
                }
 
                if (req.body.password) {
                    bcrypt.hash(req.body.password, 12).then(hash => {
                        user.password = hash;
                        user.save((err,user) => {
                            res.json(err? {error: err.message} : {success: "User updated."});
                        })
                    });
                } else {
                    user.save((err,user) => {
                        res.json(err? {error: err.message} : {success: "User updated."});
                    })
                }
            }
            }
        })
    })

    app.route('/logout')
        // Logout
        .get((req,res) => {
            if (req.user) {
                console.log("Logging out: " + req.user.username);
                res.clearCookie(req.user.id);
            }
            req.logout();
            res.redirect('/');
        });        

    app.route('/main')
        // Get and render the main view:
        .get(ensureAuthenticated, (req,res) => {
        res.render(process.cwd() + '/views/main.hbs', {
            showWelcome: true,
            user: req.user,
            admin: req.user.roles.includes('admin')
        });
    })
}