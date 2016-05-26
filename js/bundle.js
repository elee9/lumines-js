/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	
	$(function () {
	  var rootEl = $('.lumines-game');
	  new View(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	var Square = __webpack_require__(3);
	
	var View = function($el) {
	  this.$el = $el;
	  this.board = new Board();
	  this.setupGrid();
	  this.keyBind();
	  this.makeBlocks();
	  this.timer = 0;
	  this.intervalId = window.setInterval(this.step.bind(this), 10);
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
	
	  this.timer += 10;
	  this.board.fixScan();
	
	  if (this.timer % 100 === 0)
	  {
	    this.board.squareStep();
	  }
	
	  if (this.timer % 1000 === 0) {
	    this.board.blockStep();
	  }
	
	  if (this.timer % 5000 === 0) {
	    this.board.deleteStep();
	  }
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Square = __webpack_require__(3);
	var Block = __webpack_require__(4);
	
	var Board = function() {
	  this.dimY = 10;
	  this.dimX = 16;
	  this.grid = [];
	  this.squares = [];
	  this.makeGrid();
	  this.block = new Block(this);
	  this.lastBlock = "placeholder";
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
	    $('div[pos="' + pos[0] + ',' + pos[1] + '"]').addClass("square-" + square.color);
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
	  this.madeBlock = false;
	
	  if (!this.block.activeCheck() || this.block.squares.length === 0) {
	    this.makeBlock();
	    this.madeBlock = true;
	  }
	
	  if (!this.madeBlock) {
	    this.block.squares.forEach(function(square) { square.drop(); });
	  }
	};
	
	Board.prototype.checkDelete = function(queue, skip) {
	  var current = queue.pop();
	  var currentRow = current.pos[0];
	  var currentColumn = current.pos[1];
	  Board.DELTAS.forEach(function(delta) {
	    if ((currentRow === 9 && delta[0][0] === 1) || (currentColumn === 0 && delta[1][1] === -1) ||
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
	    if (this.lastBlock.fixedCheck()) {
	      var toCheck = this.lastBlock.squares.slice();
	      var skipCheck = this.lastBlock.squares.slice();
	      while (toCheck.length) {
	        this.checkDelete(toCheck, skipCheck);
	      }
	      this.lastBlock = "placeholder";
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
	  unFix.forEach(function(pos) {
	    this.squares.forEach(function(otherSquare) {
	      if (otherSquare.pos[1] === pos) {
	        otherSquare.fixed = false;
	      }
	    });
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
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports) {

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
	  if (this.pos[0] === 9 && !this.fixed) {
	    this.fixed = true;
	  }
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Square = __webpack_require__(3);
	
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
	      if (this.squares.length === 0) {
	        break;
	      }
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
	        if (square.active) {
	          divs.push($('div[pos="' + square.pos[0] + ',' + square.pos[1] + '"]'));
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
	      if (this.squares.length === 0) {
	        break;
	      }
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
	        if (square.active) {
	          divs.push($('div[pos="' + square.pos[0] + ',' + square.pos[1] + '"]'));
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map