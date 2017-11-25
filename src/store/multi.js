const UNDEFINED = '…'

const state = {
  numbers: [],
  complexity: 0,
  position: [0, 1],
  actualLevel: 0,
  lastNumbers: {
    n1: 0,
    n2: 0
  }
}

const actions = {
  generateTask ({commit}, params = {currentLevel: 0, maxLevel: 0, stats: []}) {
    commit('generate_task', params)
  }
}

const mutations = {
  generate_task (state, params) {
    /*
    const stats = '0,0,0,0,0'.split(',').map(num => Number(num))
    for (let i = 0; i < 100; i++) {
      generateNumber(state, 4, params.maxLevel, '0,0,0,0,0,0,0,0,0,0'.split(',').map(num => Number(num)))
      stats[state.actualLevel]++
    }
    console.log(stats)
    */
    let n = generateNumber(state, params.currentLevel, params.maxLevel, params.stats)

    // anti-[:::]
    while ((n.n1 === state.lastNumbers.n1 && n.n2 === state.lastNumbers.n2) ||
      (n.n1 === state.lastNumbers.n2 && n.n2 === state.lastNumbers.n1)) {
      n = generateNumber(state, params.currentLevel, params.maxLevel, params.stats)
    }

    console.log(n.n1, 'x', n.n2)

    state.lastNumbers.n1 = n.n1
    state.lastNumbers.n2 = n.n2

    const NUMBERS = [
      [
        {
          id: 'n00',
          value: '',
          correctValue: '',
          class: 'empty'
        },
        {
          id: 'n11',
          value: n.n1 + '' || '',
          correctValue: '',
          class: null
        },
        {
          id: 'n02',
          value: '',
          correctValue: '',
          class: 'empty'
        }
      ],
      [
        {
          id: 'n10',
          value: '',
          correctValue: '',
          class: 'empty'
        },
        {
          id: 'n11',
          value: n.n2 + '' || '',
          correctValue: '',
          class: null
        },
        {
          id: 'n12',
          value: '',
          correctValue: '',
          class: 'empty'
        }
      ],
      [
        {
          id: 'n20',
          value: n.n31 + '' || '',
          correctValue: '',
          class: !n.n31 && 'empty' || null
        },
        {
          id: 'n21',
          value: n.n32 + '' || '',
          correctValue: '',
          class: !n.n32 && 'empty' || null
        },
        {
          id: 'n22',
          value: '',
          correctValue: '',
          class: 'empty'
        }
      ]
    ]
    const POSITION = [Math.floor(Math.random() * NUMBERS.length), 1]
    POSITION[1] = (POSITION[0] === NUMBERS.length - 1 && n.n31 ? Math.floor(Math.random() * 2) : 1)

    // console.log(POSITION)

    NUMBERS[POSITION[0]][POSITION[1]] = {
      id: 'n' + POSITION[0] + POSITION[1],
      value: UNDEFINED,
      correctValue: n['n' + (POSITION[0] > 1 ? '3' + (POSITION[1] + 1) : (POSITION[0] + 1))] + '' || '',
      class: 'question'
    }

    // console.log(JSON.stringify(NUMBERS))

    state.numbers = NUMBERS
    state.complexity = (POSITION[0] < 2 ? 1 : POSITION[1] === 1 ? 0.7 : 0.8) *
      (params.currentLevel > state.actualLevel ? 0.7
        : (params.currentLevel < state.actualLevel ? 1.5 : 1)
      )
    state.position = POSITION
  }
}

const getters = {
  getNumbers (state) {
    return state.numbers
  },
  getComplexity (state) {
    return state.complexity
  },
  getPosition (state) {
    return state.position
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

function generateNumber (state, currentLevel = 0, max = 0, stats = []) {
  const n = {}

  const randomLevel = lnRandomScaled(currentLevel || 0.4, // zero-issue fix
    0, max)
  console.log(currentLevel, '->', randomLevel)
  state.actualLevel = randomLevel

  /*
  let i = 20
  while (i-- > 0) {
    console.log(i, lnRandomScaled(4, 0, 4))
  }
  */

  switch (randomLevel) {
    case 0:
      n.n1 = 1
      n.n2 = randomIntegerWeighted(2, 9, stats)
      break
    case 1:
      n.n1 = 2
      n.n2 = randomIntegerWeighted(3, 9, stats)
      break
    case 2:
      n.n1 = randomIntegerWeighted(2, 9, stats)
      n.n2 = n.n1
      break
    case 3:
      n.n1 = randomIntegerWeighted(3, 5, stats)
      do {
        n.n2 = randomIntegerWeighted(3, 9, stats)
      } while (n.n1 === n.n2)
      break
    default:
      n.n1 = randomIntegerWeighted(6, 9, stats)
      do {
        n.n2 = randomIntegerWeighted(6, 9, stats)
      } while (n.n1 === n.n2)
  }

  doRandomSwap(n)

  n.n31 = Math.floor(n.n1 * n.n2 / 10) || ''
  n.n32 = Math.floor(n.n1 * n.n2 - n.n31 * 10) || '0'

  return n
}

// randomizers

let spareRandom = null

function normalRandom () {
  let val, u, v, s, mul

  if (spareRandom !== null) {
    val = spareRandom
    spareRandom = null
  } else {
    do {
      u = Math.random() * 2 - 1
      v = Math.random() * 2 - 1

      s = u * u + v * v
    } while (s === 0 || s >= 1)

    mul = Math.sqrt(-2 * Math.log(s) / s)

    val = u * mul
    spareRandom = v * mul
  }

  return val / 14 // 7 standard deviations on either side
}

function normalRandomInRange (min, max) {
  let val
  do {
    val = normalRandom()
  } while (val < min || val > max)

  return val
}

function lnRandomScaled (gmean, min, max) {
  const gstddev = 500

  let r, val
  let maxIterations = 10
  let iteration = 0

  do {
    r = normalRandomInRange(-1, 1)
    r = r * Math.log(gstddev / (1 + gmean)) + Math.log(gmean)
    val = Math.floor(Math.exp(r) + 0.5)
    iteration++

    // console.log(val, gmean, min, max)
  } while (iteration < maxIterations && (val < min || val > max))

  return val
}

function randomInteger (min, max) {
  let rand = min + Math.random() * (max + 1 - min)

  rand = Math.floor(rand)

  return rand
}

function randomIntegerWeighted (min, max, stats) {
  let numbers = []

  for (let i = min; i <= max; i++) {
    for (let j = 1 + (stats[i] || -0.1); j > 0; j = j - 0.1) {
      numbers.push(i)
    }
  }

  // console.log(min, max, stats, numbers.length)

  return numbers[randomInteger(0, numbers.length - 1)]
}

function doRandomSwap (n) {
  if (Math.random() < 0.5) {
    let tmp

    tmp = n.n1
    n.n1 = n.n2
    n.n2 = tmp
  }

  return n
}
