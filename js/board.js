var Square = require('./square');
var Block = require('./block');

var Board = function() {
  this.dimY = 10;
  this.dimX = 16;
  this.grid = [];
  this.squares = [];
  this.makeGrid();
  this.block = new Block(this);
  this.lastBlock = "placeholder";
  this.freshlyMoved = [];
  this.makeBlockCheck = false;
  this.score = 0;
};

Board.BLANK_SYMBOL = '.';
Board.DELTAS = [[[-1,0], [0,-1]],
                [[-1,0], [0,1]],
                [[1,0], [0,1]],
                [[1,0], [0,-1]]];

Board.prototype.makeGrid = function () {
  for (var i = 0; i < this.dimY; i++) {
    var row = [];
    for (var j = 0; j < this.dimX; j++) {
      row.push(Board.BLANK_SYMBOL);
    }
    this.grid.push(row);
  }
};

Board.prototype.addSquares = function (squares) {
  this.squares = this.squares.concat(squares);
};

Board.prototype.validPos = function (pos) {
  return (pos[0] >= 0) && (pos[0] < this.dimY) &&
    (pos[1] >= 0) && (pos[1] < this.dimX);
};

Board.prototype.makeBlock = function () {

  this.block = new Block(this);

  var positions = [[0,7], [0,8], [1,7], [1,8]];

  positions.forEach(function(pos) {
    var $div = $('<div>');
    $div.attr('pos', pos);

    var top = 60 * pos[0];
    var left = 60 * pos[1];

    $div.css({top: top + 'px', left: left + 'px'});

    $('#squares').append($div);
  });
  this.block.squares.forEach(function(square){
    var pos = square.pos;
    $('div[pos="' + pos[0] + ',' + pos[1] + '"]').addClass("square square-" + square.color);
  });
};

Board.prototype.checkPos = function(pos) {
  if (pos[0] > 9) {
    return false;
  }
  if (this.grid[pos[0]][pos[1]] === '.') {
    return true;
  } else {
    var squareInBlock = false;
    var allSquares = this.squares.concat(this.block.squares);
    allSquares.forEach(function(square) {
      if (JSON.stringify(square.pos) === JSON.stringify(pos)) {
        if (!square.fixed) {
          squareInBlock = true;
        }
      }
    });
    return squareInBlock;
  }
};

Board.prototype.blockStep = function() {
  if (!this.madeBlock) {
    this.block.squares.forEach(function(square) { square.drop(); });
  }
};

Board.prototype.checkDelete = function(queue, skip) {
  var current = queue.pop();
  var currentRow = current.pos[0];
  var currentColumn = current.pos[1];
  Board.DELTAS.forEach(function(delta) {
    if ((currentRow === 0 && delta[0][0] === -1 || currentRow === 9 && delta[0][0] === 1) || (currentColumn === 0 && delta[1][1] === -1) ||
        (currentColumn === 15 && delta[1][1] === 1))   {
      return;
    }
    if (this.grid[currentRow + delta[0][0]][currentColumn + delta[0][1]] === current.color
        && this.grid[currentRow + delta[1][0]][currentColumn + delta[1][1]] === current.color) {
      if (this.grid[currentRow + delta[0][0]][currentColumn + delta[1][1]] === current.color) {
        current.toDelete = true;
        $('div[pos="' + current.pos[0] + ',' + current.pos[1] + '"]').addClass('delete');

        var squareOne = this.findSquare([currentRow + delta[0][0],currentColumn + delta[0][1]]);
        squareOne.toDelete = true;
        $('div[pos="' + squareOne.pos[0] + ',' + squareOne.pos[1] + '"]').addClass('delete');
        if (skip.indexOf(squareOne) === -1) {
          queue.push(squareOne);
          skip.push(squareOne);
        }
        var squareTwo = this.findSquare([currentRow + delta[1][0],currentColumn + delta[1][1]]);
        squareTwo.toDelete = true;
        $('div[pos="' + squareTwo.pos[0] + ',' + squareTwo.pos[1] + '"]').addClass('delete');
        if (skip.indexOf(squareTwo) === -1) {
          queue.push(squareTwo);
          skip.push(squareTwo);
        }
        var squareThree = this.findSquare([currentRow + delta[0][0],currentColumn + delta[1][1]]);
        squareThree.toDelete = true;
        $('div[pos="' + squareThree.pos[0] + ',' + squareThree.pos[1] + '"]').addClass('delete');
        if (skip.indexOf(squareThree) === -1) {
          queue.push(squareThree);
          skip.push(squareThree);
        }
      }
    }
  }.bind(this));
};

Board.prototype.findSquare = function(pos) {
  var result = [];
  this.squares.forEach(function(square) {
    if (JSON.stringify(square.pos) === JSON.stringify(pos)) {
      result.push(square);
    }
  });
  return result[0];
};

Board.prototype.fixScan = function () {
  var notFixed = this.squares.filter(function(square) {
    return !square.fixed;
  });

  notFixed.forEach(function(square) {
    square.checkFix();
  });
};

Board.prototype.squareStep = function() {
  if (!this.block.activeCheck()) {
    this.lastBlock = $.extend({}, this.block);
    this.addSquares(this.lastBlock.squares);
    this.block.squares = [];
  }

  if (typeof this.lastBlock === 'object') {
    if (fixedCheck(this.lastBlock.squares)) {
      this.makeBlockCheck = true;
      var toCheck = this.lastBlock.squares.slice();
      var skipCheck = this.lastBlock.squares.slice();
      while (toCheck.length) {
        this.checkDelete(toCheck, skipCheck);
      }
      this.lastBlock = "placeholder";
    }
  }

  this.madeBlock = false;
  if (!this.gameOver()) {
    if (this.makeBlockCheck) {
      this.makeBlock();
      this.makeBlockCheck = false;
      this.madeBlock = true;
    }
  }

  if (this.freshlyMoved.length > 0) {
    if (fixedCheck(this.freshlyMoved)) {
      toCheck = this.freshlyMoved.slice();
      skipCheck = this.freshlyMoved.slice();
      while (toCheck.length) {
        this.checkDelete(toCheck, skipCheck);
      }
      this.freshlyMoved = [];
    }
  }

  this.squares.forEach(function(square) { square.drop(); });
};

Board.prototype.deleteStep = function() {
  var dupedSquares = this.squares.slice();
  var unFix = [];
  var counter = 0;
  dupedSquares.forEach(function(square, idx) {
    if (square.toDelete) {
      unFix.push(square.pos[1]);
      this.squares.splice(idx - counter, 1)[0];
      $('div[pos="' + square.pos[0] + ',' + square.pos[1] + '"]').remove();
      this.grid[square.pos[0]][square.pos[1]] = '.';
      counter += 1;
    }
  }.bind(this));
  this.score += 20 * counter;
  unFix.forEach(function(pos) {
    this.squares.forEach(function(otherSquare) {
      if (otherSquare.pos[1] === pos) {
        this.freshlyMoved.push(otherSquare);
        otherSquare.fixed = false;
      }
    }.bind(this));
  }.bind(this));
};

Board.prototype.move = function(dir) {
  switch(dir) {
    case 37:
      this.block.move(dir);
      break;
    case 39:
      this.block.move(dir);
      break;
    case 40:
      this.block.move(dir);
      break;
    case 68:
      this.block.move(dir);
      break;
    case 65:
      this.block.move(dir);
      break;
  }
};

Board.prototype.moveLine = function () {
  $('.scanline').addClass("scan");
  setTimeout(function() { $('.scanline').removeClass("scan"); }, 2000);
};

var fixedCheck = function(squares) {
  var allFixed = true;
  squares.forEach(function(square) {
    if (!square.fixed) {
      allFixed = false;
    }
  });
  return allFixed;
};

Board.prototype.gameOver = function () {
  return this.squares.some(function(square) {
    if (square.fixed) {
      return (square.pos[0] === 1 || square.pos[0] === 0);
    }
  });
};

module.exports = Board;
