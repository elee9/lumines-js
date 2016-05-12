var Square = function(color, pos, board, block) {
  this.color = color;
  this.board = board;
  this.pos = pos;
  this.fixed = false;
  this.active = true;
  this.block = block;
  this.toDelete = false;
};

Square.prototype.blockDrop = function() {
  var oldPos = this.pos.slice();
  if (!this.fixed) {
    this.pos[0] += 1;
  }

  if (!this.board.checkPos([this.pos[0] + 1, this.pos[1]]) ||
      !this.board.validPos([this.pos[0] + 1, this.pos[1]])) {
    this.block.squares.forEach(function(square){
      square.active = false;
    }.bind(this));
    $('div[pos="'+ this.pos[0] + ',' + this.pos[1] +'"]').addClass('fixed');
    this.fixed = true;
  }

  this.board.grid[oldPos[0]][oldPos[1]] = ".";
  this.board.grid[this.pos[0]][this.pos[1]] = this.color;

  var $div = $('div[pos="' + oldPos[0] + ',' + oldPos[1] + '"]').attr('pos', this.pos);

  var top = 60 * this.pos[0];
  var left = 60 * this.pos[1];

  $div.css({top: top + 'px', left: left + 'px'});
};

Square.prototype.squareDrop = function() {
  var oldPos = this.pos.slice();
  $('div[pos="'+ this.pos[0] + ',' + this.pos[1] +'"]').addClass('fixed');
  if (!this.fixed) {
    this.pos[0] += 1;
  }
  if (this.pos[0] % 1 === 0){
    if (!this.board.checkPos([this.pos[0] + 1, this.pos[1]]) ||
        !this.board.validPos([this.pos[0] + 1, this.pos[1]])) {
      this.block.squares.forEach(function(square){
        square.active = false;
      }.bind(this));
      this.fixed = true;
    }
    this.board.grid[oldPos[0]][oldPos[1]] = ".";
    this.board.grid[this.pos[0]][this.pos[1]] = this.color;
  }

  var $div = $('div[pos="' + oldPos[0] + ',' + oldPos[1] + '"]').attr('pos', this.pos);

  var top = 60 * this.pos[0];
  var left = 60 * this.pos[1];

  $div.css({top: top + 'px', left: left + 'px'});
};

module.exports = Square;
