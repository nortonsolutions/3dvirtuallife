/*
* Norton 2021 - CourseApp
*
*/

'use strict';

var expect             = require('chai').expect;

module.exports = function (app, db) {

    app.route('/')
        .get((req,res) => {
            var options = {
                
            }
            res.render(process.cwd() + '/views/index.hbs', options);
        })

    app.route('/save')
        .post((req,res) => {
            let gameName = req.body.gameName;
            let heroTemplate = req.body.heroTemplate;
            let props = req.body.props;

            db.models.SavedGame.findOne({ gameName: gameName }, (err,savedGame) => {
                if (err) {
                    res.json({error: err.message});
                } else if (savedGame) { // game exists, overwrite
                    savedGame.heroTemplate = heroTemplate;
                    savedGame.props = props;
                    savedGame.save((err,savedGame) => {
                        res.json(err? {error: err.message} : {success: "saved"});
                    })
                } else { // new game
                    db.models.SavedGame.create({ 
                        gameName: gameName,
                        heroTemplate: heroTemplate,
                        props: props
                    }, (err, doc) => {
                        res.json(err? {error: err.message} : {success: "saved"});
                    });
                }
            })
        })
    

    app.route('/delete')
        .post((req,res) => {
            db.models.SavedGame.remove({_id: req.body._id}, (err,body) => {
                res.json(err? {error: err.message} : {success: "removed"});
            })
        })

    app.route('/list')
        .get((req,res) => {
            db.models.SavedGame.find({}, (err,savedGames) => {
                res.json(err? {error: err.message} : savedGames);
            });
        })

    app.route('/load/:gameName')
        .get((req,res) => {
            var gameName = req.params.gameName;
            db.models.SavedGame.findOne({ gameName: gameName }, (err,savedGame) => {
                res.json(err? {error: err.message} : savedGame);
            });
        })
        
}