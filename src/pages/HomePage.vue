<template>
  <main>
    <progress-bar :percent="currentProgressPercent"></progress-bar>

    <div class="echo">
    <echo v-for="number in numbers[0]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>×</span><echo v-for="number in numbers[1]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>=</span><echo v-for="number in numbers[2]" :key="number.id" :text="number.value" :as-class="number.class"></echo>
    </div>
    <div class="keyboard"><keyboard v-model="input" layouts="12345|67890" @input="changed" :maxlength="2"></keyboard></div>

    <b-modal ref="myModalRef" hide-footer hide-header centered title="" class="clear">
      <div class="d-block text-center">
        <h3>{{modalText}}</h3>
      </div>
      <b-btn class="mt-3" variant="outline-secondary" block @click="hideModal">Продолжить</b-btn>
    </b-modal>

    <audio ref="audioOk" src="./static/sounds/ok.wav"></audio>
    <audio ref="audioErr" src="./static/sounds/err.wav"></audio>
    <!-- https://www.audioblocks.com/royalty-free-audio/cartoon-sound-effects https://freesound.org -->
  </main>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Keyboard from 'vue-keyboard'
  import Echo from '@/components/Echo'
  import ProgressBar from '@/components/ProgressBar'
  import bModalDirective from 'bootstrap-vue/es/directives/modal/modal'
  import bBtn from 'bootstrap-vue/es/components/button/button'
  import bModal from 'bootstrap-vue/es/components/modal/modal'

  const UNDEFINED = '…'
  const BONUS_TIME = 6000
  const MAX_TIME = 15000
  const COOLDOWN = 1000
  const COOLDOWN_REVERT = 2000
  const LEVELS = [
    {
      maxProgress: 10
    },
    {
      maxProgress: 20
    },
    {
      maxProgress: 40
    },
    {
      maxProgress: 80
    },
    {
      maxProgress: 160
    }
  ]
  const MAX_LEVELS = LEVELS.length - 1
  const MAX_PROGRESS = LEVELS.reduce((a, b) => a + b.maxProgress, 0)
  const CORRECTNESS_RATIO = 5 // one incorrect equals N correct to fix it

  export default {
    components: {
      Echo,
      Keyboard,
      ProgressBar,
      'b-modal': bModal,
      'b-btn': bBtn
    },
    directives: {
      'b-modal': bModalDirective
    },
    props: {
      session: {
        type: String
      },
      incrementLevel: {
        type: Function,
        required: true
      },
      currentData: {
        type: Function,
        required: true
      },
      setData: {
        type: Function,
        required: true
      }
    },
    data: function () {
      return {
        input: '',
        progress: 250, // always start from the begining of current level
        startTime: new Date().getTime(),
        errorsInSequence: 0,
        errorState: false,
        started: new Date().getTime(),
        tries: 0,
        errors: 0,
        modalText: '',
        ended: false
      }
    },
    computed: {
      ...mapGetters({
        numbers: 'getNumbers',
        complexity: 'getComplexity',
        position: 'getPosition'
      }),
      currentProgressPercent: function () {
        const self = this

        const currentProgress = (LEVELS.reduce((a, b, index) =>
          a + (index < self.currentData().currentLevel ? b.maxProgress : 0), 0) + self.progress)

        const percent = Math.floor(currentProgress / MAX_PROGRESS * 100)

        console.log(currentProgress, percent, '%')

        return percent
      }
    },
    methods: {
      ...mapActions([
        'generateTask'
      ]),
      changed (value) {
        let vm = this
        const pressed = value[value.length - 1]

        this.input = pressed // input trim
        valueChange(vm, pressed)
      },
      showModal () {
        this.$refs.myModalRef.show()
      },
      hideModal () {
        this.$refs.myModalRef.hide()
      }
    },
    mounted () {
      let vm = this

      readSessionDataThenGenerateTask(vm)

      window.scrollTo(0, document.body.scrollHeight)

      window.addEventListener('keyup', function (event) {
        // console.log(event)
        valueChange(vm, event.key)
      })
    }
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

    if (level > 0 && level <= MAX_LEVELS && stats.length === 10 && actualCheckSum === checkSum) {
      console.log('Session get: Level -> ' + level)

      // if session start from the begin of saved level
      vm.progress = 0

      // wait for storage delay
      setTimeout(function () {
        vm.setData({
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

    window.location.replace('#' + string + ',' + checksum(string))
  }

  function valueChange (vm, value) {
    const POSSIBLE_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete']
    const DELETE_KEYS = ['Backspace', 'Delete']

    if (POSSIBLE_KEYS.includes(value)) {
      const elem = vm.numbers[vm.position[0]][vm.position[1]]

      if (elem.value && elem.correctValue && elem.value !== elem.correctValue) {
        if (DELETE_KEYS.includes(value)) {
          elem.value = UNDEFINED
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
    const newValue = Math.floor((getStats[elem.correctValue] - 1 / CORRECTNESS_RATIO) * 10) / 10
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
    }, COOLDOWN)
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
        elem.value = UNDEFINED
        elem.class = 'question'
        vm.errorState = false
      }
    }, COOLDOWN_REVERT)
  }

  function generateTask (vm) {
    console.log('tries', vm.tries, 'errors', vm.errors, Math.round(vm.errors / (vm.tries || 1) * 100) + '%')
    vm.generateTask({currentLevel: vm.currentData().currentLevel, maxLevel: MAX_LEVELS, stats: vm.currentData().stats})
  }

  function progressUp (vm, timDiff) {
    // zero progress after an error
    const multiplier = (vm.errorsInSequence > 0 ? 0
        : (timDiff >= MAX_TIME ? 0
            : (timDiff < BONUS_TIME ? 1 + Math.round(BONUS_TIME / timDiff) : 1)
        )
    )

    vm.progress += Math.floor(multiplier * vm.complexity * 10) / 10

    levelUpIfNeeded(vm)

    console.log(vm.progress, vm.currentData().currentLevel, multiplier, vm.complexity,
      Math.floor(timDiff / BONUS_TIME), vm.errorsInSequence)
  }

  function levelUpIfNeeded (vm) {
    const currentLevel = vm.currentData().currentLevel
    const maxProgress = LEVELS[currentLevel].maxProgress

    if (vm.progress > maxProgress && currentLevel < LEVELS.length - 1) {
      vm.progress -= maxProgress
      // next level reached
      vm.modalText = 'Следующий уровень! Поздравляем!'
      vm.showModal()
      vm.incrementLevel()
      rewriteLocation(vm)
    } if (vm.progress > maxProgress && currentLevel < LEVELS.length) {
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
</script>

<style>
* {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
    -webkit-focus-ring-color: rgba(255, 255, 255, 0) !important;
    outline: none !important;
}
html {
  font-size:2vw;
}
main {
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
  display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
  display: -webkit-flex;     /* NEW - Chrome */
  display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
  justify-content: center;
  align-items: center;
  overflow: auto;
}
main div {
  color: black;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-family: "Roboto", Arial, sans-serif;
  font-size: 8rem;
  padding: 20px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1;
}
main > div {
  width: 80%;
}
main .clear {
  display: block;
  position: absolute;
}
main .clear .modal-dialog {
  max-width: 700px;
}
main .clear div {
  white-space: normal;
}
.modal-dialog header {
  width: 90%;
}
.modal-header {
  border-bottom: 0;
}
main > div:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
main div span {
  display: inline-block;
  width: 5rem;
  max-width: 5rem;
  min-width: 5rem;
  overflow: hidden;
}
main div span.sign {
  width: 7rem;
  max-width: 7rem;
  min-width: 7rem;
}
main div span.empty {
  width: 0;
  max-width: 0;
  min-width: 0;
  overflow-x: hidden;
}
main div span.correct {
  color: rgb(37, 218, 37);
}
main div span.incorrect {
  color: #ff0000;
}
main div span.question {
  color: #007bff;
}
div.keyboard {
  position: absolute;
  bottom: 0.5rem;
  width: 100%;
}
div.keyboard div {
  line-height: 0.5;
}
.vue-keyboard-key {
  font-size: 2rem !important;
  padding: 1rem !important;
}
.vue-keyboard-row {
  margin-left: auto;
  margin-right: auto;
  font-size: 4rem;
}
.vue-keyboard-key:hover {
    background: #EEE !important;
}
div.modal {
    padding-left:0px !important;
}
@media screen and (max-width: 480px) and (orientation: portrait) {
    main div {
      width: 100%;
      padding: 0;
    }
    div.keyboard {
      bottom: 14rem;
    }
    .modal button {
        line-height: 5vh;
    }
}
@media screen and (max-width: 720px) and (orientation: landscape) {
    main div {
      width: 90%;
    }
   main div span.question {
      color: #007bff;
    }
  div.keyboard {
    bottom: -7vh;
  }
  div.keyboard div {
    line-height: 0.3;
  }
    .modal button {
        line-height: 5vh;
    }
}
</style>
