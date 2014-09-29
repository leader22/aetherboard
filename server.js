/**
* @file: server-side entry point.
*
* Builds a local canvas, and orchestrates
* everybody's input into a single stream
* of changes to be applied everywhere.
*/
var through = require('through2');

var http = require('http');
var server = http.createServer();

var Canvas = require('canvas');
var canvas = new Canvas(500, 500);

var invoke = require('./invoke');
var spline = require('./spline');

var Graft = require('graft');

var graft = Graft();
var merge = Graft();

require('graft/ws')
  .server({server: server})
  .pipe(graft);

graft.where({topic: 'subscribe'}, subscribe());

graft.pipe(through.obj(onlyStroke))
  .pipe(spline())
  .pipe(through.obj(log))

function subscribe() {
  return through.obj(function(msg, enc, done) {
    //canvas.pngStream().pipe(msg.initialCanvas);

    msg.strokeInput.pipe(graft);

    merge.pipe(msg.strokeSync);

    done();
  });
}

server.on('request', require('./handler')).listen(3000);

function onlyStroke(msg, enc, done) {
  console.log(msg.topic);
  if (msg.topic === 'stroke') {
    this.push(msg);
  }
  done();
}

function log(chunk, enc, done) {
  console.log(chunk);
  done(null, chunk);
}
