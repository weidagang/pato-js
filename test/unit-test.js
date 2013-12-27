#!/usr/bin/env node

var pato = require('../../pato.js');
var assert = require('assert');

var match = pato.match;

function test_value() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(1)
        .value(1, 100)
        .value(2, 200)
    .done();
    assert(100 == r, case_name + "." + (++case_i));

    var r = match('foo')
        .value(1, 100)
        .value(2, 200)
        .value('foo', 'bar')
    .done();
    assert('bar' == r, case_name + "." + (++case_i));

    var r = match('xxx')
        .value(1, 100)
        .value(2, 200)
        .value('foo', 'bar')
    .done();
    assert(null == r, case_name + "." + (++case_i));
    
    console.log('Case ' + case_name + ' passed\n');
}

function test_type() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(2)
        .value(1, 100)
        .type('number', '2')
        .value(2, 200)
    .done();
    assert('2' == r, case_name + "." + (++case_i));

    var r = match('foo')
        .value(1, 100)
        .type('number', '2')
        .type('string', 3)
        .value(2, 200)
    .done();
    assert(3 == r, case_name + "." + (++case_i));

    var r = match(function(){})
        .value(1, 100)
        .type('number', '2')
        .type('string', 3)
        .type('function', 'this is a function')
        .value(2, 200)
    .done();
    assert('this is a function' == r, case_name + "." + (++case_i));

    var r = match({ a : 'aa' })
        .value(1, 100)
        .type('number', '2')
        .type('string', 3)
        .type('object', 'this is an object')
        .type('function', 'this is a function')
        .value(2, 200)
    .done();
    assert('this is an object' == r, case_name + "." + (++case_i));

    var r = match([1, 2])
        .value(1, 100)
        .type('number', 'this a number')
        .type('string', 'this is a string')
        .type('array', 'this is an array')
        .type('object', 'this is an object')
        .type('function', 'this is a function')
    .done();
    assert('this is an array' == r, case_name + "." + (++case_i));
    
    console.log('Case ' + case_name + ' passed\n');
}

function test_instance_of() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(100)
        .value(1, 1)
        .type('number', function(x) { return 2 * x; })
        .value(2, 2)
    .done();
    assert(200 == r, case_name + "." + (++case_i));

    var r = match([1, 2, 3])
        .type('number', function(x) { return 2 * x; })
        .instance_of(Array, 'This is an instance of Array')
    .done();
    assert('This is an instance of Array' == r, case_name + "." + (++case_i));

    function Car() {};
    var car = new Car();
    var r = match(car)
        .type('number', function(x) { return 2 * x; })
        .instance_of(Car, 'This is a car')
        .type('object', 'This is an object')
    .done();
    assert('This is a car' == r, case_name + "." + (++case_i));

    console.log('Case ' + case_name + ' passed\n');
}

function test_default() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(100)
        .value(1, 1)
        .value(2, 2)
        .default(88)
    .done();
    assert(88 == r, case_name + "." + (++case_i));

    var r = match('world')
        .type('number', function(x) { return 2 * x; })
        .type('function', 'haha')
        .default('')
    .done();
    assert('' == r, case_name + "." + (++case_i));

    console.log('Case ' + case_name + ' passed\n');
}

function test_function_result() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(100)
        .value(1, 1)
        .type('number', function(x) { return 2 * x; })
        .value(2, 2)
    .done();
    assert(200 == r, case_name + "." + (++case_i));

    var r = match('world')
        .type('number', function(x) { return 2 * x; })
        .type('string', function(x) { return 'hello ' + x; })
    .done();
    assert('hello world' == r, case_name + "." + (++case_i));

    console.log('Case ' + case_name + ' passed\n');
}

test_value();
test_type();
test_instance_of();
test_default();
test_function_result();
