const UNDEFINED = '…'

const state = {
  numbers: [],
  complexity: 0,
  position: [0, 1]
}

const actions = {
  generateTask ({commit}) {
    commit('generate_task')
  }
}

const mutations = {
  generate_task (state) {
    const n = {}
    n['n1'] = Math.floor(Math.random() * 9 + 1)
    n['n2'] = Math.floor(Math.random() * 9 + 1)
    n['n31'] = Math.floor(n['n1'] * n['n2'] / 10) || ''
    n['n32'] = Math.floor(n['n1'] * n['n2'] - n['n31'] * 10) || '0'

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
          value: n['n1'] + '' || '',
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
          value: n['n2'] + '' || '',
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
          value: n['n31'] + '' || '',
          correctValue: '',
          class: !n['n31'] && 'empty' || null
        },
        {
          id: 'n21',
          value: n['n32'] + '' || '',
          correctValue: '',
          class: !n['n32'] && 'empty' || null
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
    POSITION[1] = (POSITION[0] === NUMBERS.length - 1 && n['n31'] ? Math.floor(Math.random() * 2) : 1)

    // console.log(POSITION)

    NUMBERS[POSITION[0]][POSITION[1]] = {
      id: 'n' + POSITION[0] + POSITION[1],
      value: UNDEFINED,
      correctValue: n['n' + (POSITION[0] > 1 ? '3' + (POSITION[1] + 1) : (POSITION[0] + 1))] + '' || '',
      class: 'question'
    }

    // console.log(JSON.stringify(NUMBERS))

    state.numbers = NUMBERS
    state.complexity = (POSITION[0] < 2 ? 1 : POSITION[1] === 1 ? 0.6 : 0.7)
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
