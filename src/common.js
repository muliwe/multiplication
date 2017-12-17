export default {
  readSessionDataThenGenerateTask,
  valueChange,
  currentProgressPercent
}

function currentProgressPercent (vm) {
  const currentProgress = (vm.CONFIG.LEVELS.reduce((a, b, index) =>
    a + (index < vm.currentData().currentLevel ? b.maxProgress : 0), 0) + vm.progress)

  const percent = Math.floor(currentProgress / vm.CONFIG.MAX_PROGRESS * 100)

  console.log(currentProgress, percent, '%')

  return percent
}

function readSessionDataThenGenerateTask (vm) {
  if (!vm.session) {
    generateTask(vm)
    return
  }

  const session = vm.session.split(',')
  const stats = session.slice(0, -1).slice(1).map(el => Number(el))
  const level = Number(session[0])
  const checkSum = session.slice(-1)[0]
  const actualCheckSum = checksum(level + ',' + stats)

  if (level > 0 && level <= vm.CONFIG.MAX_LEVELS && stats.length === 10 && actualCheckSum === checkSum) {
    console.log('Session get: Level -> ' + level)

    // if session start from the begin of saved level
    vm.progress = 0

    // wait for storage delay
    setTimeout(function () {
      vm.setData({
        currentApp: vm.CONFIG.APP,
        currentLevel: level,
        stats
      })
      generateTask(vm)
    }, 50)
  } else if (level === 0 && stats.length === 10 && actualCheckSum === checkSum) {
    // for testing purposes
    console.log('Session get: Level and stats dropped')

    vm.progress = 0

    // wait for storage delay
    setTimeout(function () {
      vm.setData({
        currentApp: vm.CONFIG.APP,
        currentLevel: level,
        stats
      })
      generateTask(vm)
    }, 50)
  } else {
    console.log('Checksum failed, session ignored')
    generateTask(vm)
  }
}

function checksum (s) {
  const str = '' + JSON.stringify(s)

  let chk = 0x12345678
  const len = str.length

  for (let i = 0; i < len; i++) {
    chk += (str.charCodeAt(i) * (i + 1))
  }

  return (chk & 0xffffffff).toString(16)
}

function rewriteLocation (vm) {
  let string = '' + vm.currentData().currentLevel
  const getStats = vm.currentData().stats

  for (let i = 0; i < 10; i++) {
    string += ',' + (getStats[i] || '0')
  }

  window.location.replace('#' + (vm.CONFIG.PATH ? '/' + vm.CONFIG.PATH + '/' : '') + string + ',' + checksum(string))
}

function valueChange (vm, value) {
  const POSSIBLE_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete']
  const DELETE_KEYS = ['Backspace', 'Delete']

  if (POSSIBLE_KEYS.includes(value)) {
    const elem = vm.numbers[vm.position[0]][vm.position[1]]

    if (elem.value && elem.correctValue && elem.value !== elem.correctValue) {
      if (DELETE_KEYS.includes(value)) {
        elem.value = vm.CONFIG.UNDEFINED
        elem.class = 'question'

        return
      }

      check(vm, value, elem)
    }
  }
}

function check (vm, value, elem) {
  const isTrueAnswer = value === elem.correctValue

  elem.value = value
  elem.class = isTrueAnswer ? 'correct' : 'incorrect'
  vm.$refs[isTrueAnswer ? 'audioOk' : 'audioErr'].play()

  if (isTrueAnswer) {
    complete(vm, elem)
  } else {
    error(vm, elem)
  }
}

function complete (vm, elem) {
  const getStats = vm.currentData().stats
  const newValue = Math.floor((getStats[elem.correctValue] - 1 / vm.CONFIG.CORRECTNESS_RATIO) * 10) / 10
  const timDiff = new Date().getTime() - vm.startTime

  getStats[elem.correctValue] = newValue > 0 ? newValue : 0

  vm.tries++
  vm.errorState = false

  progressUp(vm, timDiff)

  setTimeout(function () {
    // extra task if too many errors on ordinary lask
    vm.errorsInSequence = vm.errorsInSequence > 1 && vm.complexity <= 1 ? 1 : 0
    vm.startTime = new Date().getTime()

    generateTask(vm)
  }, vm.CONFIG.COOLDOWN)
}

function error (vm, elem) {
  // @todo place some help behavior here
  const getStats = vm.currentData().stats

  getStats[elem.correctValue]++

  revertLater(vm, elem)

  vm.tries++
  vm.errors++
  vm.errorsInSequence++
}

function revertLater (vm, elem) {
  vm.errorState = true

  setTimeout(function () {
    if (vm.errorState) {
      elem.value = vm.CONFIG.UNDEFINED
      elem.class = 'question'
      vm.errorState = false
    }
  }, vm.CONFIG.COOLDOWN_REVERT)
}

function generateTask (vm) {
  console.log('tries', vm.tries, 'errors', vm.errors, Math.round(vm.errors / (vm.tries || 1) * 100) + '%')
  const currentData = vm.currentData()

  vm.generateTask({
    currentApp: vm.CONFIG.APP,
    currentLevel: currentData.currentLevel,
    maxLevel: vm.CONFIG.MAX_LEVELS,
    stats: currentData.stats
  })
}

function progressUp (vm, timDiff) {
  // zero progress after an error
  const multiplier = (vm.errorsInSequence > 0 ? 0
      : (timDiff >= vm.CONFIG.MAX_TIME ? 0
          : (timDiff < vm.CONFIG.BONUS_TIME ? 1 + Math.round(vm.CONFIG.BONUS_TIME / timDiff) : 1)
      )
  )

  vm.progress += Math.floor(multiplier * vm.complexity * 10) / 10

  levelUpIfNeeded(vm)

  console.log(vm.progress, vm.currentData().currentLevel, multiplier, vm.complexity,
    Math.floor(timDiff / vm.CONFIG.BONUS_TIME), vm.errorsInSequence)
}

function levelUpIfNeeded (vm) {
  const currentLevel = vm.currentData().currentLevel
  const maxProgress = vm.CONFIG.LEVELS[currentLevel].maxProgress

  if (vm.progress > maxProgress && currentLevel < vm.CONFIG.LEVELS.length - 1) {
    vm.progress -= maxProgress
    // next level reached
    vm.modalText = 'Следующий уровень! Поздравляем!'
    vm.showModal()
    vm.incrementLevel()
    rewriteLocation(vm)
  } if (vm.progress > maxProgress && currentLevel < vm.CONFIG.LEVELS.length) {
    // max progress reached
    if (!vm.ended) {
      vm.ended = true
      vm.modalText = 'Пройти всю программу обучения за ' +
        Math.round((new Date().getTime() - vm.started) / 1000 / 60 + 1) +
        ' мин. это прекрасный результат!'
      vm.showModal()
    }
    vm.progress = maxProgress
    rewriteLocation(vm)
  }
}
