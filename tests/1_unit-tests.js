/*
* Norton - 2021 - Learning Mocha-Chai-Lodash-Zombie
*/

var chai = require('chai');
var assert = chai.assert;

suite('Unit Tests', function(){
    
    suite('Basic Assertions', function() {
        test('#isDefined, #isUndefined', function(){
            assert.isDefined( null, 'null is not undefined');
            assert.isUndefined( undefined, 'undefined IS undefined');
            assert.isDefined( 'hello', 'a string is not undefined' );
        });

        test('#isTrue, #isNotTrue', function(){
            assert.isTrue( true, 'true is true');
            assert.isTrue( !!'double negation', 'double negation of a truthy is true');
            assert.isNotTrue({ value: 'truthy' }, 'A truthy object is NOT TRUE (neither is false...)' );
        });

        test('#deepEqual, #notDeepEqual', function(){
            assert.deepEqual( { a: '1', b: 5 } , { b: 5, a: '1' }, "keys order doesn't matter" );
            assert.notDeepEqual( { a: [5, 6] }, { a: [6, 5] }, "array elements position does matter !!" );
        });

        function weirdNumbers(delta) {
            return (1 + delta - Math.random());
        }

        test('#approximately', function() {
            assert.approximately(weirdNumbers(0.5) , 1, 0.5 );
            assert.approximately(weirdNumbers(0.2) , 1, 0.8 );
        });

        var formatPeople = function(name, age) {
            return '# name: ' + name + ', age: ' + age + '\n';
        };

        test('#match, #notMatch', function() {
            var regex =  /^#\sname\:\s[\w\s]+,\sage\:\s\d+\s?$/;
            assert.match(formatPeople('John Doe', 35), regex);
            assert.notMatch(formatPeople('Paul Smith III', 'twenty-four'), regex);
        });
    });



});