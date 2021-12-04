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

  // ### EXAMPLE - asyncronous operations ### 
  test('Asynchronous test #example', function(done){
    setTimeout(function(){
      assert.isOk('Async test !!');
      done(); /** Call 'done()' when the async operation is completed**/
    }, 100);
  });

  suite('General API route testing', function() {
    
    test('GET /', (done) => {
      chai.request(server)
        .get('/')
        .end((err,res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.match(res.text, /Welcome to/, 'GET / should return welcome screen');
          assert.equal(res.type, 'text/html', 'Response should be type "text/html"');
          done();
        })
    });

    test('GET invalid URL',(done) => {
      chai.request(server)
        .get('/asdfsadfa')
        .end((err,res) => {
          assert.equal(res.status, 404, 'Response status should be 404');
          assert.match(res.text, /[nN]ot [Ff]ound/, 'Response should indicate "Not Found"');
          done();
        })
    });

    test('GET /quiz',(done) => {
      chai.request(server)
        .get('/quiz')
        .end((err,res) => {
          assert.equal(res.status, 404, 'Response status should be 404');
          done();
        })
    });

    suite('User creation', function() {

      test('Create new user',(done) => {
        chai.request(server)
          .post('/register')
          .send({username: 'Leassim', firstname: "Leassim", surname: "Hernandez", password: 'emkcuf'})
          .end((req,res) => {
            assert.match(res.redirects[0], /main/, 'Response should include a redirect to /main');
            done();
          })
      });
    });

    suite('Login and Logout', function() {
      test('Login',(done) => {
        chai.request(server)
          .post('/login')
          .send({username: 'Leassim', password: 'emkcuf'})
          .end((req,res) => {
            assert.match(res.redirects[0], /main/, 'Response should include a redirect to /main');
            done();
          })
      });

      test('Logout',(done) => {
        chai.request(server)
          .get('/logout')
          .end((req,res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.match(res.text, /Welcome to/, 'GET / should return welcome screen');
            done();
          })
        });
    });
  });

  suite('e2e with Zombie:', () => {
    Browser.site = 'http://localhost:3000'; 

    suite('Login and Logout as test user', function() {

      const browser = new Browser();

      suiteSetup(function(done) {
        return browser.visit('/', done); // Browser asynchronous operations take a callback
      });

      test('Login',(done) => {
        browser
          .fill('username', 'Leassim')
          .fill('password', 'emkcuf')
          .pressButton('Submit', () => {
            browser.assert.success();
            browser.assert.url(/main/)
            browser.assert.text('p.lead', /Select a Course/);
            done();
          })
      });

      test('Access Course page',(done) => {
        browser.visit('/courseSelect', () => {
          browser.assert.success();
          browser.assert.url(/courseSelect/);
          browser.assert.text('h1', /Course Selection/);
          done();
        });
      });

      test('Logout',(done) => {
        browser.visit('/logout', () => {
          browser.assert.success();
          browser.assert.text('h2', /Welcome to/);
          done();
        });
      })
    });

    suite('Login and Logout as admin user', function() {

      const browser = new Browser();

      suiteSetup(function(done) {
        return browser.visit('/', done); // Browser asynchronous operations take a callback
      });

      test('Login',(done) => {
        browser
          .fill('username', 'dave')
          .fill('password', 'dave')
          .pressButton('Submit', () => {
            browser.assert.success();
            browser.assert.url(/main/)
            browser.assert.text('p.lead', /Select a Course/);
            done();
          })
      });

      var testUserId = '';
      test('Access Admin page',(done) => {
        browser.visit('/admin', () => {
          testUserId = browser.response.body.match(/\"(.+?)\"\>Hernandez/)[1];
          browser.assert.success();
          browser.assert.url(/admin/);
          browser.assert.text('h1', /Main Admin/);
          done();
        });
      });

      test('Delete test user',(done) => {
        browser.fetch('/deleteAccount', {
          method: 'POST',
          body: JSON.stringify({ "_id": testUserId }),
          headers: { "Content-Type": "application/json; charset=utf-8" }
        })
        .then(function(response) {
          // console.log('Status code:', response.status);
          assert.equal(response.status, 200, 'Response status should be 200');
          // if (response.status === 200)
          //   return response.text();
          done();
        })
        // .then(function(text) {
        //   // console.log('Document:', text);
        //   done();
        // })
        // .catch(function(error) {
        //   // console.log('Network error');
        //   done();
        // });
      });

      test('Logout',(done) => {
        browser.visit('/logout', () => {
          browser.assert.success();
          browser.assert.text('h2', /Welcome to/);
          done();
        });
      })
    });
  });
});
