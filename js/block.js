var Square = require('./square');

var SQUARE_COLORS = ['light', 'dark'];

var Block = function(board) {
  this.board = board;
  this.squares = [];
  this.new();
};

Block.prototype.new = function() {
  this.squares = [];

  this.squares.push(new Square(SQUARE_COLORS[Math.floor(Math.random() *
                               SQUARE_COLORS.length)], [1, 7], this.board, this));
  this.board.grid[this.squares[0].pos[0]][this.squares[0].pos[1]] =
                                                        this.squares[0].color;
  this.squares.push(new Square(SQUARE_COLORS[Math.floor(Math.random() *
                               SQUARE_COLORS.length)], [1, 8], this.board, this));
  this.board.grid[this.squares[1].pos[0]][this.squares[1].pos[1]] =
                                                        this.squares[1].color;
  this.squares.push(new Square(SQUARE_COLORS[Math.floor(Math.random() *
                               SQUARE_COLORS.length)], [0, 7], this.board, this));
  this.board.grid[this.squares[2].pos[0]][this.squares[2].pos[1]] =
                                                        this.squares[2].color;
  this.squares.push(new Square(SQUARE_COLORS[Math.floor(Math.random() *
                               SQUARE_COLORS.length)], [0, 8], this.board, this));
  this.board.grid[this.squares[3].pos[0]][this.squares[3].pos[1]] =
                                                        this.squares[3].color;
};

Block.prototype.activeCheck = function () {
  var active = true;
  this.squares.forEach(function(square) {
    if (!square.active) {
      active = false;
    }
  });
  return active;
};

Block.prototype.fixedCheck = function() {
  var allFixed = true;
  this.squares.forEach(function(square) {
    if (!square.fixed) {
      allFixed = false;
    }
  });
  return allFixed;
};

Block.prototype.move = function(dir) {
  switch(dir) {
    case 37:
      var valid = true;
      var divs = [];
      this.squares.forEach(function(square) {
        if (!this.board.validPos([square.pos[0], square.pos[1] - 1])
            || !this.board.checkPos([square.pos[0], square.pos[1] - 1 ])){
            valid = false;
        }
      }.bind(this));

      if (valid) {
        this.squares.forEach(function(square) {
          if (square.active) {
            var oldPos = square.pos.slice();
            square.pos[1] -= 1;
            this.board.grid[oldPos[0]][oldPos[1]] = ".";
            this.board.grid[square.pos[0]][square.pos[1]] = square.color;

            divs.push($('div[pos="' + oldPos[0] + ',' + oldPos[1] + '"]'));
          }
        }.bind(this));


        var i = 0;
        this.squares.forEach(function(square, idx) {
          if (square.active) {
            divs[i].attr('pos', square.pos);
            var top = 60 * square.pos[0];
            var left = 60 * square.pos[1];

            divs[i].css({top: top + 'px', left: left + 'px'});
            i += 1;
          }
        });

        this.squares.forEach(function(square) {
          if (!square.board.checkPos([square.pos[0] + 1, square.pos[1]]) ||
              !square.board.validPos([square.pos[0] + 1, square.pos[1]])) {
            square.block.squares.forEach(function(otherSquare){
              setTimeout(function() {$('div[pos="'+ otherSquare.pos[0] + ',' + otherSquare.pos[1] +'"]').addClass('fixed');}, 550);
              otherSquare.active = false;
            });
          }
        });
      }
      break;

    case 39:
      valid = true;
      divs = [];
      this.squares.forEach(function(square) {
        if (!this.board.validPos([square.pos[0], square.pos[1] + 1])
            || !this.board.checkPos([square.pos[0], square.pos[1] + 1 ])){
            valid = false;
        }
      }.bind(this));

      if (valid) {
        this.squares.forEach(function(square) {
          if (square.active) {
            var oldPos = square.pos.slice();
            square.pos[1] += 1;
            this.board.grid[oldPos[0]][oldPos[1]] = ".";
            this.board.grid[square.pos[0]][square.pos[1]] = square.color;

            divs.push($('div[pos="' + oldPos[0] + ',' + oldPos[1] + '"]'));
          }
        }.bind(this));


        i = 0;
        this.squares.forEach(function(square, idx) {
          if (square.active) {
            divs[i].attr('pos', square.pos);
            var top = 60 * square.pos[0];
            var left = 60 * square.pos[1];

            divs[i].css({top: top + 'px', left: left + 'px'});
            i += 1;
          }
        });

        this.squares.forEach(function(square) {
          if (!square.board.checkPos([square.pos[0] + 1, square.pos[1]]) ||
              !square.board.validPos([square.pos[0] + 1, square.pos[1]])) {
            square.block.squares.forEach(function(otherSquare){
              setTimeout(function() {$('div[pos="'+ otherSquare.pos[0] + ',' + otherSquare.pos[1] +'"]').addClass('fixed');}, 550);
              otherSquare.active = false;
            });
          }
        });
      }
      break;

    case 40:
      this.squares.forEach(function(otherSquare){
        $('div[pos="'+ otherSquare.pos[0] + ',' + otherSquare.pos[1] +'"]').addClass('fixed');
        otherSquare.active = false;
      });

      break;

    case 68:
      var j = 0;
      divs = [];
      this.squares.forEach(function(square) {
        var delta;
        switch(j) {
          case 0:
            delta = [-1, 0];
            break;
          case 1:
            delta = [0, -1];
            break;
          case 2:
            delta = [0, 1];
            break;
          case 3:
            delta = [1, 0];
            break;
        }
        var newPos = [square.pos[0] + delta[0], square.pos[1] + delta[1]];
        divs.push($('div[pos="' + square.pos[0] + ',' + square.pos[1] + '"]'));
        if (square.active) {
          this.board.grid[square.pos[0]][square.pos[1]] = '.';
          square.pos = newPos;
          this.board.grid[newPos[0]][newPos[1]] = square.color;
        }
        j += 1;
      }.bind(this));


      i = 0;

      this.squares.forEach(function(square, idx) {
        if (square.active) {
          divs[i].attr('pos', square.pos);
          var top = 60 * square.pos[0];
          var left = 60 * square.pos[1];

          divs[i].css({top: top + 'px', left: left + 'px'});
          i += 1;
        }
      });


      var tempSquares = [this.squares[1], this.squares[3], this.squares[0], this.squares[2]];
      this.squares = tempSquares;

      this.squares.forEach(function(square) {
        if (!square.board.checkPos([square.pos[0] + 1, square.pos[1]]) ||
        !square.board.validPos([square.pos[0] + 1, square.pos[1]])) {
          square.block.squares.forEach(function(otherSquare){
            setTimeout(function() {$('div[pos="'+ otherSquare.pos[0] + ',' + otherSquare.pos[1] +'"]').addClass('fixed');}, 550);
            otherSquare.active = false;
          });
        }
      });
      break;

    case 65:
      j = 0;
      divs = [];
      this.squares.forEach(function(square) {
        var delta;
        switch(j) {
          case 0:
            delta = [0, 1];
            break;
          case 1:
            delta = [-1, 0];
            break;
          case 2:
            delta = [1, 0];
            break;
          case 3:
            delta = [0, -1];
            break;
        }
        var newPos = [square.pos[0] + delta[0], square.pos[1] + delta[1]];
        divs.push($('div[pos="' + square.pos[0] + ',' + square.pos[1] + '"]'));
        if (square.active) {
          this.board.grid[square.pos[0]][square.pos[1]] = '.';
          square.pos = newPos;
          this.board.grid[newPos[0]][newPos[1]] = square.color;
        }
        j += 1;
      }.bind(this));


      i = 0;

      this.squares.forEach(function(square, idx) {
        if (square.active) {
          divs[i].attr('pos', square.pos);
          var top = 60 * square.pos[0];
          var left = 60 * square.pos[1];

          divs[i].css({top: top + 'px', left: left + 'px'});
          i += 1;
        }
      });

      var tempSquares = [this.squares[2], this.squares[0], this.squares[3], this.squares[1]];
      this.squares = tempSquares;

      this.squares.forEach(function(square) {
        if (!square.board.checkPos([square.pos[0] + 1, square.pos[1]]) ||
            !square.board.validPos([square.pos[0] + 1, square.pos[1]])) {
          square.block.squares.forEach(function(otherSquare){
            setTimeout(function() {$('div[pos="'+ otherSquare.pos[0] + ',' + otherSquare.pos[1] +'"]').addClass('fixed');}, 550);
            otherSquare.active = false;
          });
        }
      });
      break;


    }


};

module.exports = Block;
