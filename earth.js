#!/usr/bin/env node
/*
 * earth
 * Cam Pedersen
 * Oct 21, 2011
 */

var fs = require('fs'),
    tty = require('tty'),
    colors = require('colors');

function write(data){
  process.stdout.write(data || '');
}

var earth = {
  fps: 0.4,
  escape: '\033[',
  frames: [],
  frame: 0,

  clear: function(){
    write(earth.escape + '2J');
  },
  pos: function(x, y){
    if (x && y) write(earth.escape + String(y) + ';' + String(x) + 'f');
  },

  renderFrame: function(){
    var window = tty.getWindowSize(1),
        width = window[1],
        height = window[0];
    earth.clear();
    //earth.pos(Math.floor(width / 2) - 2, 5);
    //write('ecto'.rainbow);
    var frame = earth.frames[earth.frame];
    var rows = frame.split('\n');
    for (var i in rows) {
      var row = rows[i].trim().split('');
      for (var j in row) {
        var x = Math.floor(width / 2) + Number(j) - Math.floor(row.length / 2),
            y = Math.ceil(height / 2) + Number(i) - Math.ceil(rows.length / 2) + 1;
        earth.pos(x, y);
        if (row[j] == ' ') console.log('.'.blue);
        else write(row[j].green);
      }
    }
    earth.pos(width, height);
  },

  load: function(cb){
    for (var i = 0; i < 15; i++) {
      var frame = fs.readFileSync(__dirname + '/frames/' + i).toString();
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
