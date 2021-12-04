/*
* Norton 2021 - CourseApp
*
*/

'use strict';

var expect             = require('chai').expect;

module.exports = function (app) {

    app.route('/')
        .get((req,res) => {
            var options = {
                
            }
            res.render(process.cwd() + '/views/index.hbs', options);
        })
        
    app.route('/scene/:level')
        // Get and render the index view
        .get((req,res) => {

            var options = {
                level: req.params.level
            }
            res.render(process.cwd() + '/views/scene.hbs', options);
        })

}