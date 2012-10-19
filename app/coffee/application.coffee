
Array::shuffle = -> @sort -> 0.5 - Math.random()


app =
  table:
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
      tu: 'つ',
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

  rowCount: null

  pairs: []

  currentPair: null

  queue: []

  correct: 0,
  incorrect: 0,

  start: ->
    @insertTable()
    @resizeTable()
    self = @
    $(window).resize ->
      self.resizeTable()
    $('.choice').live 'click', (e) =>
      @checkInput($(e.target).data('roman'), $(e.target).data('kana'))
    @reset()
    $('#reset-button').click =>
      @reset()

  reset: ->
    @correct = 0
    @incorrect = 0
    @queue = []
    @displayStats()
    @displayChallenge()

  insertTable: ->
    @pairs = []
    @rowCount = 0
    for row_roman, row of @table
      @rowCount += 1
      $row_el = $('<tr/>')
      for roman, kana of row
        $cell_el = $('<td/>')
        if kana
          $cell_el.attr('id', "choice_#{roman}")
          $cell_el.addClass('choice')
          $cell_el.data('roman', roman)
          $cell_el.data('kana', kana)
          $cell_el.append roman
          @pairs.push [roman, kana]
        $row_el.append $cell_el

      $('#choices tbody').append($row_el)

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
    @populateQueue()
    newPair = @pairs.shift()
    @currentPair = newPair
    $('#challenge').html(@currentPair[1])
    $('#incorrect').html('')

  checkInput: (selectedRoman, selectedKana) ->
    correctRoman = @currentPair[0]
    if selectedRoman == correctRoman
      @displayChallenge()
      @correct += 1
    else
      @reinsertToQueue(@currentPair[0], @currentPair[1])
      @reinsertToQueue(selectedRoman, selectedKana)
      @displayIncorrect(selectedRoman, selectedKana)
      @incorrect += 1
    @displayStats()

  displayIncorrect: (selectedRoman, selectedKana) ->
    $('#incorrect').html(selectedKana)

  reinsertToQueue: (roman, kana) ->
    e = [roman, kana]
    @concatToQueue [e, e, e]
    @queue = @queue.shuffle()

  displayStats: ->
    $('#correct-count').html(@correct)
    $('#incorrect-count').html(@incorrect)
    unless @correct+@incorrect == 0
      $('#correct-percentage').html("#{Math.floor(@correct/(@correct+@incorrect)*100)}%")
    else
      $('#correct-percentage').html("0%")




$(document).ready ->
  app.start()
