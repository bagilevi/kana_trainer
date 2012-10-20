(function() {
  var app;

  Array.prototype.shuffle = function() {
    return this.sort(function() {
      return 0.5 - Math.random();
    });
  };

  app = {
    table: {
      a: {
        a: 'あ',
        i: 'い',
        u: 'う',
        e: 'え',
        o: 'お'
      },
      k: {
        ka: 'か',
        ki: 'き',
        ku: 'く',
        ke: 'け',
        ko: 'こ'
      }
    },
    rowCount: null,
    pairs: [],
    currentPair: null,
    queue: [],
    correct: 0,
    incorrect: 0,
    start: function() {
      var self,
        _this = this;
      this.insertTable();
      this.resizeTable();
      self = this;
      $(window).resize(function() {
        return self.resizeTable();
      });
      $('.choice').live('click', function(e) {
        return _this.checkInput($(e.target).data('roman'), $(e.target).data('kana'));
      });
      this.reset();
      return $('#reset-button').click(function() {
        return _this.reset();
      });
    },
    reset: function() {
      this.correct = 0;
      this.incorrect = 0;
      this.queue = [];
      this.displayStats();
      return this.displayChallenge();
    },
    insertTable: function() {
      var $cell_el, $row_el, kana, roman, row, row_roman, _ref, _results;
      this.pairs = [];
      this.rowCount = 0;
      _ref = this.table;
      _results = [];
      for (row_roman in _ref) {
        row = _ref[row_roman];
        this.rowCount += 1;
        $row_el = $('<tr/>');
        for (roman in row) {
          kana = row[roman];
          $cell_el = $('<td/>');
          if (kana) {
            $cell_el.attr('id', "choice_" + roman);
            $cell_el.addClass('choice');
            $cell_el.data('roman', roman);
            $cell_el.data('kana', kana);
            $cell_el.append(roman);
            this.pairs.push([roman, kana]);
          }
          $row_el.append($cell_el);
        }
        _results.push($('#choices tbody').append($row_el));
      }
      return _results;
    },
    resizeTable: function() {
      var fontSize, rowSize;
      rowSize = ($(window).height() - 10) / (this.rowCount + 1) - 4;
      fontSize = rowSize / 2;
      if (fontSize > 15) {
        fontSize -= (fontSize - 15) / 2;
      }
      $('#choices thead td').css('height', "" + rowSize + "px").css('font-size', "" + (fontSize * 1.5) + "px");
      $('#choices tbody td').css('height', "" + rowSize + "px").css('font-size', "" + fontSize + "px");
      return $('#stats').css('font-size', fontSize * 0.75);
    },
    populateQueue: function() {
      if (this.queue.length < 20) {
        return this.concatToQueue(this.pairs.shuffle());
      }
    },
    concatToQueue: function(a) {
      return Array.prototype.push.apply(this.queue, a);
    },
    displayChallenge: function() {
      var newPair;
      this.populateQueue();
      newPair = this.queue.shift();
      this.currentPair = newPair;
      $('#challenge').html(this.currentPair[1]);
      return $('#incorrect').html('');
    },
    checkInput: function(selectedRoman, selectedKana) {
      var correctRoman;
      correctRoman = this.currentPair[0];
      if (selectedRoman === correctRoman) {
        this.displayChallenge();
        this.correct += 1;
      } else {
        this.reinsertToQueue(this.currentPair[0], this.currentPair[1]);
        this.reinsertToQueue(selectedRoman, selectedKana);
        this.displayIncorrect(selectedRoman, selectedKana);
        this.incorrect += 1;
      }
      return this.displayStats();
    },
    displayIncorrect: function(selectedRoman, selectedKana) {
      return $('#incorrect').html(selectedKana);
    },
    reinsertToQueue: function(roman, kana) {
      var e;
      e = [roman, kana];
      this.concatToQueue([e, e, e]);
      return this.queue = this.queue.shuffle();
    },
    displayStats: function() {
      $('#correct-count').html(this.correct);
      $('#incorrect-count').html(this.incorrect);
      if (this.correct + this.incorrect !== 0) {
        return $('#correct-percentage').html("" + (Math.floor(this.correct / (this.correct + this.incorrect) * 100)) + "%");
      } else {
        return $('#correct-percentage').html("0%");
      }
    },
    debugQueue: function() {
      var pair, s, _i, _len, _ref;
      s = "";
      _ref = this.queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        s += "" + pair[0] + " ";
      }
      return console.log(s);
    }
  };

  $(document).ready(function() {
    return app.start();
  });

}).call(this);
