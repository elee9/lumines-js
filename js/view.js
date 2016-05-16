var Board = require('./board');
var Square = require('./square');

var View = function($el) {
  this.$el = $el;
  this.board = new Board();
  this.setupGrid();
  this.keyBind();
  this.makeBlocks();
  this.timer = 0;
  this.intervalId = window.setInterval(this.step.bind(this), 100);
};

View.prototype.setupGrid = function(){
  var $ul = $('<ul>');
  $ul.addClass('cf');
  this.$el.append($ul);
  var $div = $('<div>');
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
    $('div[pos="' + pos[0] + ',' + pos[1] + '"]').addClass("square-" + square.color);
  });

};

View.prototype.keyBind = function() {
  $(window).on('keydown', function(event){
    this.board.move(event.which);
  }.bind(this));
};

View.prototype.step = function() {

  this.timer += 100;
  this.board.squareStep();

  if (this.timer % 1000 === 0) {
    this.board.blockStep();
  }
};

module.exports = View;
