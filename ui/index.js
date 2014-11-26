// Copy the index.html to the output folder
require('./index.html');

// require the main.css
require('./main.css');

// famous related requires
require('famous-polyfills');
var Engine = require('famous/src/core/Engine');
var Modifier   = require('famous/src/core/Modifier');
var Whiteboard = require('./whiteboard');

// create the main famous context
var mainContext = Engine.createContext();

var modOpts = {
  size: [1920, 1080],
//  origin: [0.5, 0.5],
//  align: [0.5, 0.5]
};

var whiteboard = new Whiteboard({
  canvasSize: [1920, 1080]
});
var modifier = new Modifier(modOpts);

// add the modifier and then the surface to the tree.
mainContext
  .add(modifier)
  .add(whiteboard);

module.exports = whiteboard;
