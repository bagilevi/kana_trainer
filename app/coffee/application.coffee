
Array::shuffle = -> @sort -> 0.5 - Math.random()


app =
  table:
    hiragana:
      a:
        a: 'あ',
        i: 'い',
        u: 'う',
        e: 'え',
        o: 'お',
      k:
        ka: 'か',
        ki: 'き',
        ku: 'く',
        ke: 'け',
        ko: 'こ',
      s:
        sa: 'さ',
        shi: 'し',
        su: 'す',
        se: 'せ',
        so: 'そ',
      t:
        ta: 'た',
        chi: 'ち',
        tsu: 'つ',
        te: 'て',
        to: 'と',
      n:
        na: 'な',
        ni: 'に',
        nu: 'ぬ',
        ne: 'ね',
        no: 'の',
      h:
        ha: 'は',
        hi: 'ひ',
        fu: 'ふ',
        he: 'へ',
        ho: 'ほ',
      m:
        ma: 'ま',
        mi: 'み',
        mu: 'む',
        me: 'め',
        mo: 'も',
      y:
        ya: 'や',
        yi: null,
        yu: 'ゆ',
        ye: null,
        yo: 'よ',
      r:
        ra: 'ら',
        ri: 'り',
        ru: 'る',
        re: 'れ',
        ro: 'ろ',
      w:
        wa: 'わ',
        wi: 'ゐ',
        n: 'ん',
        we: 'ゑ',
        wo: 'を',
    #katakana:
      #a:
        #a: 'ア',
        #i: 'イ',
        #u: 'ウ',
        #e: 'エ',
        #o: 'オ',
      #k:
        #ka: 'カ',
        #ki: 'キ',
        #ku: 'ク',
        #ke: 'ケ',
        #ko: 'コ',
      #s:
        #sa: 'サ',
        #shi: 'シ',
        #su: 'ス',
        #se: 'セ',
        #so: 'ソ',
      #t:
        #ta: 'タ',
        #chi: 'チ',
        #tsu: 'ツ',
        #te: 'テ',
        #to: 'ト',
      #n:
        #na: 'ナ',
        #ni: 'ニ',
        #nu: 'ヌ',
        #ne: 'ネ',
        #no: 'ノ',
      #h:
        #ha: 'ハ',
        #hi: 'ヒ',
        #fu: 'フ',
        #he: 'ヘ',
        #ho: 'ホ',
      #m:
        #ma: 'マ',
        #mi: 'ミ',
        #mu: 'ム',
        #me: 'メ',
        #mo: 'モ',
      #y:
        #ya: 'ヤ',
        #yi: null,
        #yu: 'ユ',
        #ye: null,
        #yo: 'ヨ',
      #r:
        #ra: 'ラ',
        #ri: 'リ',
        #ru: 'ル',
        #re: 'レ',
        #ro: 'ロ',
      #w:
        #wa: 'ワ',
        #wi: 'ヰ',
        #n: 'ン',
        #we: 'ヱ',
        #wo: 'ヲ',


  rowCount: null

  pairs: []

  currentPair: null

  queue: []

  correct: 0,
  incorrect: 0,

  failCount: 0, # for current kana
  highlighted: false

  start: ->
    @preparePairs()
    @insertTable()
    @resizeTable()
    self = @
    $(window).resize ->
      self.resizeTable()
    $('.choice').live 'click', (e) =>
      @checkInput($(e.target))
    @reset()
    $('#reset-button').click =>
      @reset()

  reset: ->
    @correct = 0
    @incorrect = 0
    @queue = []
    @displayStats()
    @displayChallenge()
    @score = 0

  insertTable: ->
    @rowCount = 0
    alreadyInserted = false
    for syllabary, subtable of @table
      for row_romaji, row of subtable
        if alreadyInserted
          @addDataToHtmlRow(syllabary, row)
        else
          @rowCount += 1
          $rowEl = @buildHtmlRow(syllabary, row)
          $('#choices tbody').append($rowEl)
      alreadyInserted = true


  buildHtmlRow: (syllabary, row) ->
    $rowEl = $('<tr/>')
    for romaji, kana of row
      $cellEl = $('<td/>')
      if kana
        $cellEl.attr('id', "choice_#{romaji}")
        $cellEl.addClass('choice')
        $cellEl.data('romaji', romaji)
        $cellEl.data(syllabary, kana)
        $cellEl.append romaji
      $rowEl.append $cellEl
    $rowEl

  addDataToHtmlRow: (syllabary, row) ->
    for romaji, kana of row
      $cellEl = $("#choice_#{romaji}")
      if kana
        $cellEl.data(syllabary, kana)

  preparePairs: ->
    @pairs = []
    for syllabary, subtable of @table
      for row_romaji, row of subtable
        for romaji, kana of row
          if kana
            @pairs.push [romaji, kana, syllabary]


  resizeTable: ->
    rowSize = ($(window).height() - 10) / (@rowCount + 1) - 4
    fontSize = rowSize / 2
    if fontSize > 15
      fontSize -= (fontSize - 15) / 2
    $('#choices thead td').css('height', "#{rowSize}px").css('font-size', "#{fontSize * 1.5}px")
    $('#choices tbody td').css('height', "#{rowSize}px").css('font-size', "#{fontSize }px")
    $('#stats').css('font-size', fontSize * 0.75)


  populateQueue: ->
    if @queue.length < 20
      @concatToQueue @pairs.shuffle()

  concatToQueue: (a) ->
    Array::push.apply @queue, a


  displayChallenge: ->
    @tDisplayed = new Date().getTime();
    @populateQueue()
    newPair = @queue.shift()
    if @currentPair
      while newPair[0] == @currentPair[0]
        @queue.push(newPair)
        newPair = @queue.shift()
    @currentPair = newPair
    $('#challenge').html(@currentPair[1])
    $('#incorrect').html('')
    @failCount = 0
    @highlighted = false

  checkInput: ($el) ->
    selectedRomaji = $el.data('romaji')
    sylabbary = @currentPair[2]
    selectedKana = $el.data(sylabbary)
    correctRomaji = @currentPair[0]
    if selectedRomaji == correctRomaji
      unless @highlighted
        @correct += 1
        tAnswered = new Date().getTime()
        answerDelayMs = (tAnswered - @tDisplayed)
        if answerDelayMs >= 2500
          @reinsertToQueue(@currentPair)
        @scoreSuccess(answerDelayMs)
      @displayChallenge()
    else
      @failCount += 1
      @reinsertToQueue(@currentPair)
      @reinsertToQueue([selectedRomaji, selectedKana, sylabbary])
      @displayIncorrect(selectedRomaji, selectedKana)
      @incorrect += 1
      @scoreFailure()
    @displayStats()
    if @failCount >= 3
      @highlighted = true
      @highlightCorrectAnswer(correctRomaji)

    #@debugQueue()

  displayIncorrect: (selectedRomaji, selectedKana) ->
    $('#incorrect').html(selectedKana)

  reinsertToQueue: (pair) ->
    @concatToQueue [pair, pair, pair]
    @queue = @queue.shuffle()

  highlightCorrectAnswer: (romaji) ->
    $("#choice_#{romaji}").addClass('highlighted-correct')
    setTimeout ->
      $("#choice_#{romaji}").removeClass('highlighted-correct')
    , 1000

  displayStats: ->
    #$('#correct-count').html(@correct)
    #$('#incorrect-count').html(@incorrect)
    #unless @correct+@incorrect == 0
      #$('#correct-percentage').html("#{Math.floor(@correct/(@correct+@incorrect)*100)}%")
    #else
      #$('#correct-percentage').html("0%")
    $('#correct-count').html(@score)

  debugQueue: ->
    s = ""
    for pair in @queue
      s += "#{pair[0]} "
    console.log s

  scoreSuccess: (delayMs) ->
    if delayMs <= 5000
      if delayMs <= 500
        @score += 10
      else if delayMs <= 600
        @score += 9
      else if delayMs <= 700
        @score += 8
      else if delayMs <= 800
        @score += 7
      else if delayMs <= 900
        @score += 6
      else if delayMs <= 1000
        @score += 5
      else if delayMs <= 1100
        @score += 4
      else if delayMs <= 1300
        @score += 3
      else if delayMs <= 1500
        @score += 2
      else
        @score += 1

  scoreFailure: ->
    @score -= Math.max(10, @score / 2)
    @score = 0 if @score < 0




$(document).ready ->
  app.start()
