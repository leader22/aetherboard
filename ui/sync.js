var Engine = require('famous/src/core/Engine');

var GenericSync = require("famous/src/inputs/GenericSync");
var MouseSync   = require("famous/src/inputs/MouseSync");
var TouchSync   = require("famous/src/inputs/TouchSync");
var ScrollSync  = require("famous/src/inputs/ScrollSync");

GenericSync.register({
  mouse : MouseSync,
  touch : TouchSync,
  scroll : ScrollSync
});

module.exports = function() {
  var genericSync = new GenericSync(['mouse', 'touch']);//, 'scroll']);
  Engine.pipe(genericSync);
  return genericSync;
};
