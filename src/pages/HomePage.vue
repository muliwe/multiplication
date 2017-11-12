<template>
  <main>
    <progress-bar :percent="currentProgressPercent"></progress-bar>

    <div>
    <echo v-for="number in numbers[0]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>×</span><echo v-for="number in numbers[1]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>=</span><echo v-for="number in numbers[2]" :key="number.id" :text="number.value" :as-class="number.class"></echo>
    </div>
    <div class="keyboard"><keyboard v-model="input" layouts="12345|67890" @input="changed" :maxlength="2"></keyboard></div>

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

  const UNDEFINED = '…'
  const BONUS_TIME = 6000
  const MAX_TIME = 15000
  const COOLDOWN = 1000
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

  export default {
    components: {
      Echo,
      Keyboard,
      ProgressBar
    },
    props: {
      incrementLevel: {
        type: Function,
        required: true
      },
      currentLevel: {
        type: Number,
        required: true
      }
    },
    data: function () {
      return {
        input: '',
        progress: 0, // always start from the begining of current level
        startTime: new Date().getTime(),
        errors: 0
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

        const currentProgress = (LEVELS.reduce((a, b, index) => a + (index < self.currentLevel ? b.maxProgress : 0), 0) +
          self.progress)

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
        valueChange(pressed, vm)
      }
    },
    mounted () {
      let vm = this

      generateTask(vm)

      window.addEventListener('keyup', function (event) {
        // console.log(event)
        valueChange(event.key, vm)
      })
    }
  }

  function valueChange (value, vm) {
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

        check(value, elem, vm)
      }
    }
  }

  function check (value, elem, vm) {
    const isTrueAnswer = value === elem.correctValue

    elem.value = value
    elem.class = isTrueAnswer ? 'correct' : 'incorrect'
    vm.$refs[isTrueAnswer ? 'audioOk' : 'audioErr'].play()

    if (isTrueAnswer) {
      complete(vm)
    } else {
      // @todo wrong answer, place some help here

      vm.errors++
    }
  }

  function complete (vm) {
    const timDiff = new Date().getTime() - vm.startTime

    progressUp(timDiff, vm)

    setTimeout(function () {
      vm.errors = vm.errors > 1 && vm.complexity <= 1 ? 1 : 0 // extra task if too many errors on ordinary lask
      vm.startTime = new Date().getTime()

      generateTask(vm)

    }, COOLDOWN)
  }

  function generateTask (vm) {
    vm.generateTask({currentLevel: vm.currentLevel, maxLevel: MAX_LEVELS})
  }

  function progressUp (timDiff, vm) {
    const multiplier = (vm.errors > 0 ? 0
        : (timDiff >= MAX_TIME ? 0
            : (timDiff < BONUS_TIME ? 1 + Math.round(BONUS_TIME / timDiff) : 1)
        )
    )

    vm.progress += Math.floor(multiplier * vm.complexity * 10) / 10

    levelUpIfNeeded(vm)

    console.log(vm.progress, vm.currentLevel, multiplier, vm.complexity, Math.floor(timDiff / BONUS_TIME), vm.errors)
  }

  function levelUpIfNeeded (vm) {
    if (vm.progress > LEVELS[vm.currentLevel].maxProgress && vm.currentLevel < LEVELS.length - 1) {
      vm.progress -= LEVELS[vm.currentLevel].maxProgress
      // next level reached
      // @todo add some behavior here
      vm.incrementLevel()
      console.log('Bump!')
    } if (vm.progress > LEVELS[vm.currentLevel].maxProgress && vm.currentLevel < LEVELS.length) {
      // max progress reached
      // @todo add come behavior here
      vm.progress = LEVELS[vm.currentLevel].maxProgress
    }
  }
</script>

<style>
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
  width: 80%;
  padding: 20px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  line-height:1;
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

@media screen and (max-width: 480px) and (orientation: portrait) {
    main div {
      width: 100%;
      padding:0;
    }
    div.keyboard {
      bottom: 14rem;
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
    bottom: 0;
  }
  div.keyboard div {
    line-height: 0.3;
  }
}
</style>
