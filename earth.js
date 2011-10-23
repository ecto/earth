#!/usr/bin/env node
/*
 * earth
 * Cam Pedersen
 * Oct 21, 2011
 */

var fs = require('fs'),
    window = require('tty').getWindowSize(1),
    colors = require('colors');

function write(data){
  process.stdout.write(data || '');
}

var earth = {
  fps: 0.3,
  escape: '\033[',
  frames: [],
  frame: 0,
  width: window[0],
  height: window[1],

  clear: function(){
    write(earth.escape + '2J');
  },
  pos: function(x, y){
    write(earth.escape + y + ';' + x + 'H');
  },

  renderFrame: function(){
    earth.clear();
    console.log(earth.frame);
    var frame = earth.frames[earth.frame];
    write(frame);
  },

  load: function(cb){
    for (var i = 0; i < 15; i++) {
      var frame = fs.readFileSync('frames/' + i).toString();
      earth.frames.push(frame);
    }
    cb();
  },

  init: function(){
    earth.load(function(){
      setInterval(function(){
        earth.renderFrame();
        earth.frame++;
        if (earth.frame >= earth.frames.length) earth.frame = 0;
      }, 60 / earth.fps);
    });
  }
}

earth.init();
