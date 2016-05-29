var Board = require('./board');
var Square = require('./square');

var View = function($el) {
  this.$el = $el;
  this.board = new Board();
  this.setupGrid();
  this.makeBlocks();
  this.bindStart();
  this.timer = 0;
  this.gameIsStarted = false;
};

View.prototype.start = function () {
  if (!this.gameIsStarted) {
    $('.overlay').css("display", "none");
    $('.instructions').css("display","none");
    this.keyBind();
    this.gameIsStarted = true;
    this.intervalId = window.setInterval(this.step.bind(this), 10);
  } else {
    $('.gameover').css("display", "none");
    $('.overlay').css("display", "none");
    this.board = new Board();
    $('#squares').empty();
    this. makeBlocks();
    this.timer = 0;
    this.intervalId = window.setInterval(this.step.bind(this), 10);
  }
};

View.prototype.bindStart = function () {
  $(window).on('keydown', function(event){
    if (event.which === 13) {
      this.start();
    }
  }.bind(this));
};

View.prototype.setupGrid = function(){
  var $ul = $('<ul>');
  $ul.addClass('cf');
  this.$el.append($ul);
  var $div = $('<div>');
  var $scanline = $('<div>').addClass("scanline");
  $ul.append($scanline);
  $div.attr('id', 'squares');
  $ul.append($div);
  for(var i = 0; i < this.board.dimY; i++){
    for(var j = 0; j < this.board.dimX; j++) {
      var $li = $('<li>');
      $li.attr('pos', [j, i]);
      if (i < 2) {
        $li.addClass('nostyle');
      }
      $ul.append($li);
    }
  }
};

View.prototype.makeBlocks = function() {
  var positions = [[0,7], [0,8], [1,7], [1,8]];

  positions.forEach(function(pos) {
    var $div = $('<div>');
    $div.attr('pos', pos);

    var top = 60 * pos[0];
    var left = 60 * pos[1];

    $div.css({top: top + 'px', left: left + 'px'});

    $('#squares').append($div);
  });
  this.board.block.squares.forEach(function(square){
    var pos = square.pos;
    $('div[pos="' + pos[0] + ',' + pos[1] + '"]').addClass("square square-" + square.color);
  });

};

View.prototype.keyBind = function() {
  $(window).on('keydown', function(event){
    this.board.move(event.which);
  }.bind(this));
};

View.prototype.step = function() {

  this.timer += 10;
  this.board.fixScan();

  if (this.board.gameOver()) {
    window.clearInterval(this.intervalId);
    $('.score')[0].innerHTML = "Score: " + this.board.score;
    $('.gameover').css("display","flex");
    $('.overlay').css("display","flex");
  } else {
    if (this.timer % 50 === 0)
    {
      if (this.board.gameOver()) {
        console.log('test');
      }
      this.board.squareStep();
    }

    if (this.timer % 1500 === 0) {
      this.board.blockStep();
    }

    if (this.timer % 5000 === 0) {
      this.board.moveLine();
      setTimeout(function() { this.board.deleteStep(); }.bind(this), 1000);
      setTimeout(function() { this.board.deleteStep(); }.bind(this), 2000);
    }
  }
};

module.exports = View;
