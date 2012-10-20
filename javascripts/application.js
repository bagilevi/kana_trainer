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
      },
      katakana: {
        a: {
          a: 'ア',
          i: 'イ',
          u: 'ウ',
          e: 'エ',
          o: 'オ'
        },
        k: {
          ka: 'カ',
          ki: 'キ',
          ku: 'ク',
          ke: 'ケ',
          ko: 'コ'
        },
        s: {
          sa: 'サ',
          shi: 'シ',
          su: 'ス',
          se: 'セ',
          so: 'ソ'
        },
        t: {
          ta: 'タ',
          chi: 'チ',
          tsu: 'ツ',
          te: 'テ',
          to: 'ト'
        },
        n: {
          na: 'ナ',
          ni: 'ニ',
          nu: 'ヌ',
          ne: 'ネ',
          no: 'ノ'
        },
        h: {
          ha: 'ハ',
          hi: 'ヒ',
          fu: 'フ',
          he: 'ヘ',
          ho: 'ホ'
        },
        m: {
          ma: 'マ',
          mi: 'ミ',
          mu: 'ム',
          me: 'メ',
          mo: 'モ'
        },
        y: {
          ya: 'ヤ',
          yi: null,
          yu: 'ユ',
          ye: null,
          yo: 'ヨ'
        },
        r: {
          ra: 'ラ',
          ri: 'リ',
          ru: 'ル',
          re: 'レ',
          ro: 'ロ'
        },
        w: {
          wa: 'ワ',
          wi: 'ヰ',
          n: 'ン',
          we: 'ヱ',
          wo: 'ヲ'
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
      this.displayChallenge();
      return this.score = 0;
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
          this.scoreSuccess(answerDelayMs);
        }
        this.displayChallenge();
      } else {
        this.failCount += 1;
        this.reinsertToQueue(this.currentPair);
        this.reinsertToQueue([selectedRomaji, selectedKana, sylabbary]);
        this.displayIncorrect(selectedRomaji, selectedKana);
        this.incorrect += 1;
        this.scoreFailure();
      }
      this.displayStats();
      if (this.failCount >= 3) {
        this.highlighted = true;
        return this.highlightCorrectAnswer(correctRomaji);
      }
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
      return $('#correct-count').html(this.score);
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
    },
    scoreSuccess: function(delayMs) {
      if (delayMs <= 5000) {
        if (delayMs <= 500) {
          return this.score += 10;
        } else if (delayMs <= 600) {
          return this.score += 9;
        } else if (delayMs <= 700) {
          return this.score += 8;
        } else if (delayMs <= 800) {
          return this.score += 7;
        } else if (delayMs <= 900) {
          return this.score += 6;
        } else if (delayMs <= 1000) {
          return this.score += 5;
        } else if (delayMs <= 1100) {
          return this.score += 4;
        } else if (delayMs <= 1300) {
          return this.score += 3;
        } else if (delayMs <= 1500) {
          return this.score += 2;
        } else {
          return this.score += 1;
        }
      }
    },
    scoreFailure: function() {
      this.score -= Math.max(10, this.score / 2);
      if (this.score < 0) {
        return this.score = 0;
      }
    }
  };

  $(document).ready(function() {
    return app.start();
  });

}).call(this);
