const UNDEFINED = '…'

const state = {
  numbers: []
}

const actions = {
  generateTask ({commit}) {
    commit('generate_task')
  }
}

const mutations = {
  generate_task (state) {
    const n1 = Math.floor(Math.random() * 9 + 1)
    const n2 = Math.floor(Math.random() * 9 + 1)
    const n31 = Math.floor(n1 * n2 / 10) || ''
    const n32 = Math.floor(n1 * n2 - n31 * 10) || '0'

    state.numbers = [
      [
        {
          id: 'n00',
          value: '',
          correctValue: '',
          class: 'empty'
        },
        {
          id: 'n01',
          value: UNDEFINED,
          correctValue: n1 + '' || '',
          class: 'question'
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
          value: n2 + '' || '',
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
          value: n31 + '' || '',
          correctValue: '',
          class: !n31 && 'empty' || null
        },
        {
          id: 'n21',
          value: n32 + '' || '',
          correctValue: '',
          class: !n32 && 'empty' || null
        },
        {
          id: 'n22',
          value: '',
          correctValue: '',
          class: 'empty'
        }
      ]
    ]
  }
}

const getters = {
  getNumbers (state) {
    return state.numbers
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
