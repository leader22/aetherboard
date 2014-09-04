// file: main entry point for webpack

// Copy the index.html to the output folder
require('./index.html');

// require the main.css
require('./main.css');

// base-level requires
var through = require('through2');
var stream = require('readable-stream');

// famous related requires
require('famous-polyfills');
var Engine = require('famous/core/Engine');
var Modifier   = require('famous/core/Modifier');
var Whiteboard = require('./whiteboard');

// create the main famous context
var mainContext = Engine.createContext();
var modOpts = { size: [500, 500], origin: [0.5, 0.5] };
var whiteboard = new Whiteboard();
var modifier = new Modifier(modOpts);

// require my services
var sync = require('./sync');
var input = require('../input');
var prop = require('../property');
var invoke = require('../invoke');
var spline = require('../spline');

// set up graft, websockets and return channel streams.
var graft = require('graft')();
//var client = require('graft/ws').client();
var drawInput = graft.ReadChannel();
var drawSync = graft.WriteChannel();
var pngStream = graft.WriteChannel();

graft.write({
  topic: 'subscribe',
  drawInput: drawInput,
  drawSync: drawSync,
  pngStream: pngStream
});

// initial image loaded into the canvas
//pngStream.pipe(whiteboard.image);

// normalize mouse input into strokes+segments
var inputStream = input(sync);

// send my strokes to the server
//inputStream.pipe(drawInput);

/*
// apply everyone's strokes to the canvas
drawSync
  .pipe(prop('segments'))
  .pipe(spline())
  .pipe(invoke(whiteboard.ctx));
*/
// apply my strokes to the canvas
// TODO: write to scratch-space canvas first
//
var log = through(function (chunk, encoding, callback) {
  this.push(chunk);
  return callback();
});

inputStream
  .pipe(prop('segments'))
  .pipe(spline())
  .pipe(invoke(whiteboard.ctx));

// add the modifier and then the surface to the tree.
mainContext 
  .add(modifier)
  .add(whiteboard);