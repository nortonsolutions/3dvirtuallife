/*
* Norton - 2021 - Learning Mocha-Chai-ChaiHTTP-Lodash-Zombie
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var _ = require('lodash');

var server = require('../server');
var Browser = require('zombie');

chai.use(chaiHttp);

suite('Functional Tests', function() {

});
