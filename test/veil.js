// The veil unit tests
//
// Copyright 2011 Iris Couch
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

var tap = require('tap')
  , test = tap.test
  , util = require('util')

var veil = require('../veil')

test('API', function(t) {
  var veil

  t.doesNotThrow(function() { veil = require('../veil') }, 'Require module')
  t.type(veil, 'object', 'Veil module looks good')

  t.type(veil.parse, 'function', '.parse()')
  t.type(veil.defaults, 'function', 'Defaultable API')

  t.throws(function() { veil.parse() }, 'Throw for no parameters')
  t.throws(function() { veil.parse(null) }, 'Throw for null parameter')
  t.throws(function() { veil.parse(123) }, 'Throw for number parameter')
  t.throws(function() { veil.parse(/foo/) }, 'Throw for regex parameter')
  t.throws(function() { veil.parse(['list']) }, 'Throw for array parameter')
  t.throws(function() { veil.parse({x:'hi'}) }, 'Throw for object parameter')

  t.doesNotThrow(function() { veil.parse("") }, 'No throw for string parameter')
  t.doesNotThrow(function() { veil.parse("", 1) }, 'No throw for numeric "options"')
  t.doesNotThrow(function() { veil.parse("", {x:1}) }, 'No throw for object options')

  t.end()
})

test('Basic parsing', function(t) {
  var veil = require('../veil')

  ; ['\n', '\r\n'].forEach(function(NL) {
    var msg = veil.parse(message(NL))

    t.type(msg, 'object', 'Parsed message object')

    t.equal(Object.keys(msg).length, 7, 'Correct key count')
    t.equal(msg['Date'], 'Tue, 17 Jan 2012 03:01:04 GMT', 'Good value: Date')
    t.equal(msg['Subject'], 'The subject', 'Good value: Subject')
    t.equal(msg['Content-Type'], 'text/plain; charset=utf8', 'Good value: Content-Type')
    t.equal(msg['X-CouchDB-Stuff'], 'CouchDB stuff', 'Good value: X-CouchDB-Stuff')
    t.equal(msg['Number'], '123', 'Good value: Number')
    t.equal(msg['Negative'], '-123', 'Good value: Negative')

    t.equal(msg['body'], 'Body line 1\nline 2\n\nLine 4', 'Good value: body')
  })

  t.end()
})

function message(newline) {
  return [ 'Date: Tue, 17 Jan 2012 03:01:04 GMT'
         , 'Subject: The subject'
         , 'Content-Type: text/plain; charset=utf8'
         , 'X-CouchDB-Stuff: CouchDB stuff'
         , 'Number: 123'
         , 'Negative: -123'
         , ''
         , 'Body line 1'
         , 'line 2'
         , ''
         , 'Line 4'
         ].join(newline)
}