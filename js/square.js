var Square = function(color, pos, board, block) {
  this.color = color;
  this.board = board;
  this.pos = pos;
  this.fixed = false;
  this.active = true;
  this.block = block;
  this.toDelete = false;
};

Square.prototype.drop = function() {
  var oldPos = this.pos.slice();
  if (!this.fixed) {
    this.pos[0] += 1;
  }

  if (!this.board.checkPos([this.pos[0] + 1, this.pos[1]]) ||
      !this.board.validPos([this.pos[0] + 1, this.pos[1]])) {
    this.block.squares.forEach(function(square){
      setTimeout(function() {$('div[pos="'+ square.pos[0] + ',' + square.pos[1] +'"]').addClass('fixed');}, 550);
      square.active = false;
    });
  }

  this.board.grid[oldPos[0]][oldPos[1]] = ".";
  this.board.grid[this.pos[0]][this.pos[1]] = this.color;

  var $div = $('div[pos="' + oldPos[0] + ',' + oldPos[1] + '"]').attr('pos', this.pos);

  var top = 60 * this.pos[0];
  var left = 60 * this.pos[1];

  $div.css({top: top + 'px', left: left + 'px'});
};

Square.prototype.checkFix = function () {
  var blockBelow = [this.pos[0] + 1, this.pos[1]];
  if (!this.board.validPos(blockBelow)) {
    $('div[pos="'+ this.pos[0] + ',' + this.pos[1] +'"]').addClass('fixed');
    this.fixed = true;
  } else if (this.board.grid[blockBelow[0]][blockBelow[1]] !== '.') {
    this.board.squares.forEach(function(square) {
      if (JSON.stringify(square.pos) === JSON.stringify(blockBelow)) {
        if (square.fixed) {
          $('div[pos="'+ this.pos[0] + ',' + this.pos[1] +'"]').addClass('fixed');
          this.fixed = true;
        }
      }
    }.bind(this));
  }
};


module.exports = Square;
