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
  height: Number(window[0]),
  width: Number(window[1]),

  clear: function(){
    write(earth.escape + '2J');
  },
  pos: function(x, y){
    write(earth.escape + String(y) + ';' + String(x) + 'f');
  },

  renderFrame: function(){
    earth.clear();
    var frame = earth.frames[earth.frame];
    var rows = frame.split('\n');
    for (var i in rows) {
      var row = rows[i].trim().split('');
      for (var j in row) {
        var x = Math.floor(earth.width / 2) + Number(j) - Math.floor(row.length / 2),
            y = Math.ceil(earth.height / 2) + Number(i) - Math.ceil(rows.length / 2);
        earth.pos(x, y);
        write(row[j]);
      }
    }
    earth.pos(earth.width, earth.height);
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
