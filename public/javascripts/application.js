(function() {
  var app;

  Array.prototype.shuffle = function() {
    return this.sort(function() {
      return 0.5 - Math.random();
    });
  };

  app = {
    table: {
      hiragana: {
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
        },
        s: {
          sa: 'さ',
          shi: 'し',
          su: 'す',
          se: 'せ',
          so: 'そ'
        },
        t: {
          ta: 'た',
          chi: 'ち',
          tsu: 'つ',
          te: 'て',
          to: 'と'
        },
        n: {
          na: 'な',
          ni: 'に',
          nu: 'ぬ',
          ne: 'ね',
          no: 'の'
        },
        h: {
          ha: 'は',
          hi: 'ひ',
          fu: 'ふ',
          he: 'へ',
          ho: 'ほ'
        },
        m: {
          ma: 'ま',
          mi: 'み',
          mu: 'む',
          me: 'め',
          mo: 'も'
        },
        y: {
          ya: 'や',
          yi: null,
          yu: 'ゆ',
          ye: null,
          yo: 'よ'
        },
        r: {
          ra: 'ら',
          ri: 'り',
          ru: 'る',
          re: 'れ',
          ro: 'ろ'
        },
        w: {
          wa: 'わ',
          wi: 'ゐ',
          n: 'ん',
          we: 'ゑ',
          wo: 'を'
        }
      }
    },
    rowCount: null,
    pairs: [],
    currentPair: null,
    queue: [],
    correct: 0,
    incorrect: 0,
    failCount: 0,
    highlighted: false,
    start: function() {
      var self,
        _this = this;
      this.preparePairs();
      this.insertTable();
      this.resizeTable();
      self = this;
      $(window).resize(function() {
        return self.resizeTable();
      });
      $('.choice').live('click', function(e) {
        return _this.checkInput($(e.target));
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
      var $rowEl, alreadyInserted, row, row_romaji, subtable, syllabary, _ref, _results;
      this.rowCount = 0;
      alreadyInserted = false;
      _ref = this.table;
      _results = [];
      for (syllabary in _ref) {
        subtable = _ref[syllabary];
        for (row_romaji in subtable) {
          row = subtable[row_romaji];
          if (alreadyInserted) {
            this.addDataToHtmlRow(syllabary, row);
          } else {
            this.rowCount += 1;
            $rowEl = this.buildHtmlRow(syllabary, row);
            $('#choices tbody').append($rowEl);
          }
        }
        _results.push(alreadyInserted = true);
      }
      return _results;
    },
    buildHtmlRow: function(syllabary, row) {
      var $cellEl, $rowEl, kana, romaji;
      $rowEl = $('<tr/>');
      for (romaji in row) {
        kana = row[romaji];
        $cellEl = $('<td/>');
        if (kana) {
          $cellEl.attr('id', "choice_" + romaji);
          $cellEl.addClass('choice');
          $cellEl.data('romaji', romaji);
          $cellEl.data(syllabary, kana);
          $cellEl.append(romaji);
        }
        $rowEl.append($cellEl);
      }
      return $rowEl;
    },
    addDataToHtmlRow: function(syllabary, row) {
      var $cellEl, kana, romaji, _results;
      _results = [];
      for (romaji in row) {
        kana = row[romaji];
        $cellEl = $("#choice_" + romaji);
        if (kana) {
          _results.push($cellEl.data(syllabary, kana));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    preparePairs: function() {
      var kana, romaji, row, row_romaji, subtable, syllabary, _ref, _results;
      this.pairs = [];
      _ref = this.table;
      _results = [];
      for (syllabary in _ref) {
        subtable = _ref[syllabary];
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (row_romaji in subtable) {
            row = subtable[row_romaji];
            _results1.push((function() {
              var _results2;
              _results2 = [];
              for (romaji in row) {
                kana = row[romaji];
                if (kana) {
                  _results2.push(this.pairs.push([romaji, kana, syllabary]));
                } else {
                  _results2.push(void 0);
                }
              }
              return _results2;
            }).call(this));
          }
          return _results1;
        }).call(this));
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
      this.tDisplayed = new Date().getTime();
      this.populateQueue();
      newPair = this.queue.shift();
      if (this.currentPair) {
        while (newPair[0] === this.currentPair[0]) {
          this.queue.push(newPair);
          newPair = this.queue.shift();
        }
      }
      this.currentPair = newPair;
      console.log('currentPair', this.currentPair);
      $('#challenge').html(this.currentPair[1]);
      $('#incorrect').html('');
      this.failCount = 0;
      return this.highlighted = false;
    },
    checkInput: function($el) {
      var answerDelayMs, correctRomaji, selectedKana, selectedRomaji, sylabbary, tAnswered;
      selectedRomaji = $el.data('romaji');
      sylabbary = this.currentPair[2];
      selectedKana = $el.data(sylabbary);
      correctRomaji = this.currentPair[0];
      if (selectedRomaji === correctRomaji) {
        if (!this.highlighted) {
          this.correct += 1;
          tAnswered = new Date().getTime();
          answerDelayMs = tAnswered - this.tDisplayed;
          if (answerDelayMs >= 2500) {
            this.reinsertToQueue(this.currentPair);
          }
        }
        this.displayChallenge();
      } else {
        this.failCount += 1;
        this.reinsertToQueue(this.currentPair);
        this.reinsertToQueue([selectedRomaji, selectedKana, sylabbary]);
        this.displayIncorrect(selectedRomaji, selectedKana);
        this.incorrect += 1;
      }
      this.displayStats();
      if (this.failCount >= 3) {
        this.highlighted = true;
        this.highlightCorrectAnswer(correctRomaji);
      }
      return this.debugQueue();
    },
    displayIncorrect: function(selectedRomaji, selectedKana) {
      return $('#incorrect').html(selectedKana);
    },
    reinsertToQueue: function(pair) {
      this.concatToQueue([pair, pair, pair]);
      return this.queue = this.queue.shuffle();
    },
    highlightCorrectAnswer: function(romaji) {
      $("#choice_" + romaji).addClass('highlighted-correct');
      return setTimeout(function() {
        return $("#choice_" + romaji).removeClass('highlighted-correct');
      }, 1000);
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
