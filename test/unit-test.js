#!/usr/bin/env node

var pato = require('../pato.js');
var assert = require('assert');

var match = pato.match;
var int = pato.types.int;

function test_equal() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(1)
        .equal(1).then(100)
        .equal(2).then(200)
    .done();
    assert(100 == r, case_name + "." + (++case_i));

    var r = match('foo')
        .equal(1).then(100)
        .equal(2).then(200)
        .equal('foo').then('bar')
    .done();
    assert('bar' == r, case_name + "." + (++case_i));

    var r = match('xxx')
        .equal(1).then(100)
        .equal(2).then(200)
        .equal('foo').then('bar')
    .done();
    assert(null == r, case_name + "." + (++case_i));
    
    console.log('Case ' + case_name + ' passed\n');
}

function test_type() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(2)
        .equal(1).then(100)
        .type('number').then('2')
        .equal(2).then(200)
    .done();
    assert('2' == r, case_name + "." + (++case_i));

    var r = match('foo')
        .equal(1).then(100)
        .type('number').then('2')
        .type('string').then(3)
        .equal(2).then(200)
    .done();
    assert(3 == r, case_name + "." + (++case_i));

    var r = match(function(){})
        .equal(1).then(100)
        .type('number').then('2')
        .type('string').then(3)
        .type('function').then('this is a function')
        .equal(2).then(200)
    .done();
    assert('this is a function' == r, case_name + "." + (++case_i));

    var r = match({ a : 'aa' })
        .equal(1).then(100)
        .type('number').then('2')
        .type('string').then(3)
        .type('object').then('this is an object')
        .type('function').then('this is a function')
        .equal(2).then(200)
    .done();
    assert('this is an object' == r, case_name + "." + (++case_i));

    var r = match([1, 2])
        .equal(1).then(100)
        .type('number').then('this a number')
        .type('string').then('this is a string')
        .type('array').then('this is an array')
        .type('object').then('this is an object')
        .type('function').then('this is a function')
    .done();
    assert('this is an array' == r, case_name + "." + (++case_i));
    
    console.log('Case ' + case_name + ' passed\n');
}

function test_instance_of() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(100)
        .equal(1).then(1)
        .type('number').then(function(x) { return 2 * x; })
        .equal(2).then(2)
    .done();
    assert(200 == r, case_name + "." + (++case_i));

    var r = match([1, 2, 3])
        .type('number').then(function(x) { return 2 * x; })
        .instance_of(Array).then('This is an instance of Array')
    .done();
    assert('This is an instance of Array' == r, case_name + "." + (++case_i));

    function Car() {};
    var car = new Car();
    var r = match(car)
        .type('number').then(function(x) { return 2 * x; })
        .instance_of(Car).then('This is a car')
        .type('object').then('This is an object')
    .done();
    assert('This is a car' == r, case_name + "." + (++case_i));

    console.log('Case ' + case_name + ' passed\n');
}

function test_any() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(100)
        .equal(1).then(1)
        .equal(2).then(2)
        .any().then(88)
    .done();
    assert(88 == r, case_name + "." + (++case_i));

    var r = match('world')
        .type('number').then(function(x) { return 2 * x; })
        .type('function').then('haha')
        .any().then('')
    .done();
    assert('' == r, case_name + "." + (++case_i));

    console.log('Case ' + case_name + ' passed\n');
}

function test_if() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match({ age : 31, male : true, name : 'todd'})
        .type('number').then(function(x) { return 2 * x; })
        .type('function').then('haha')
        .if({ name : 'todd' }).then('hi todd')
        .any().then('')
    .done();
    assert('hi todd' == r, case_name + "." + (++case_i));

    var r = match({ age : 31, male : true, name : 'todd'})
        .type('number').then(function(x) { return 2 * x; })
        .type('function').then('haha')
        .if({ age : int(10, 35), male : true }).then('young man')
        .if({ age : int(10, 19) }).then('teenager')
        .any().then('')
    .done();
    assert('young man' == r, case_name + "." + (++case_i));

    var r = match({ age : 1, male : true, name : 'monad'})
        .type('number').then(function(x) { return 2 * x; })
        .type('function').then('haha')
        .if({ age : int(10, 35), male : true }).then('young man')
        .if({ age : int(10, 19) }).then('teenager')
        .if({ age : int(0, 10), male : true }).then('little boy')
        .any().then('')
    .done();
    assert('little boy' == r, case_name + "." + (++case_i));

    var r = match({ age : 29, male : false, name : 'april'})
        .type('number').then(function(x) { return 2 * x; })
        .type('function').then('haha')
        .if({ age : int(10, 35), male : true }).then('young man')
        .if(function(x) { return x.age < 30 && !x.male; }).then('young girl')
        .if({ age : int(10, 19) }).then('teenager')
        .if({ age : int(0, 10), male : true }).then('little boy')
        .any().then('')
    .done();
    assert('young girl' == r, case_name + "." + (++case_i));

    console.log('Case ' + case_name + ' passed\n');
}

function test_result() {
    var case_name = arguments.callee.name;
    var case_i = 0;
    console.log('Begin case ' + case_name);
   
    var r = match(100)
        .equal(1).then(1)
        .type('number').then(function(x) { return 2 * x; })
        .equal(2).then(2)
    .done();
    assert(200 == r, case_name + "." + (++case_i));
    
    var flag = false;
    var r = match('world')
        .type('number').then(function(x) { return 2 * x; })
        .type('string').then(function(x) { flag = true; return 'hello ' + x; })
    .done();
    assert('hello world' == r, case_name + "." + (++case_i));
    assert(true == flag, case_name + "." + (++case_i));
    
    var person = { age : 29, male : false, name : 'april'};
    var r = match(person.age, person)
        .if(int(0, 9)).then(function(x) { return 'baby ' + x.name; })
        .if(int(10, 19)).then(function(x) { return 'teenager ' + x.name; })
        .if(int(20, 35)).then(function(x) { return 'young ' + x.name; })
        .if(int(36)).then(function(x) { return 'old ' + x.name; })
        .any().then('')
    .done();
    assert('young april' == r, case_name + "." + (++case_i));

    console.log('Case ' + case_name + ' passed\n');
}

test_equal();
test_type();
test_instance_of();
test_any();
test_if();

test_result();
