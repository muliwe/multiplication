<template>
  <main>
    <div>
    <echo v-for="number in numbers[0]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>×</span><echo v-for="number in numbers[1]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>=</span><echo v-for="number in numbers[2]" :key="number.id" :text="number.value" :as-class="number.class"></echo>
    </div>
    <div class="keyboard"><keyboard v-model="input" layouts="12345|67890" @input="changed" :maxlength="2"></keyboard></div>
    
    <header>
        <div id="level">
            <span class="achieved">0</span>
            <span class="achieved">1</span>
            <span class="unlocked">2</span>
            <span class="locked">3</span>
            <span class="locked">4</span>
        </div>
        <div id="progressBar"><div style="max-width:60%;min-width:60%;width:60%"></div></div>
    </header>
    
    <audio ref="audioOk" src="./static/sounds/ok.wav"></audio>
    <audio ref="audioErr" src="./static/sounds/err.wav"></audio>
    <!-- https://www.audioblocks.com/royalty-free-audio/cartoon-sound-effects https://freesound.org -->
  </main>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Keyboard from 'vue-keyboard'
  import Echo from '@/components/Echo'

  const UNDEFINED = '…'
  const BONUS_TIME = 6000
  const MAX_TIME = 15000

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

  export default {
    components: {
      Echo,
      Keyboard
    },
    data: function () {
      return {
        input: '',
        progress: 0, // @todo get from storage
        currentLevel: 0, // @todo get from storage
        startTime: new Date().getTime(),
        errors: 0
      }
    },
    computed: {
      ...mapGetters({
        numbers: 'getNumbers',
        complexity: 'getComplexity',
        position: 'getPosition'
      })
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

      vm.generateTask(vm.currentLevel, LEVELS.length - 1)

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
      vm.generateTask(vm.currentLevel, LEVELS.length - 1)
    }, 2000)
  }

  function progressUp (timDiff, vm) {
    const multiplier = (vm.errors > 0 ? 0
        : (timDiff >= MAX_TIME ? 0
            : (timDiff < BONUS_TIME ? 1 + Math.round(BONUS_TIME / timDiff) : 1)
        )
    )

    vm.progress += Math.floor(multiplier * vm.complexity * 10) / 10

    if (vm.progress > LEVELS[vm.currentLevel].maxProgress && vm.currentLevel < LEVELS.length - 1) {
      vm.progress -= LEVELS[vm.currentLevel].maxProgress
      vm.currentLevel++
    } if (vm.progress > LEVELS[vm.currentLevel].maxProgress && vm.currentLevel < LEVELS.length) {
      // max progress reached
      vm.progress = LEVELS[vm.currentLevel].maxProgress
    }

    // @todo set to storage

    console.log(vm.progress, vm.currentLevel, multiplier, vm.complexity, Math.floor(timDiff / BONUS_TIME), vm.errors)
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
main div:after {
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
header {
    padding: 0px;
    padding-top:1rem;
    position: absolute;
    top: 0;
    font-size: 1rem;
    width:80%
}
div#progressBar {
    border: solid #007bff 2px;
    border-radius: 15px;
    width:100%;
    padding: 0px;
    height:2rem;
}
div#progressBar div {
    color: white;
    text-align:right;
    background-color: #007bff;
    overflow-x:hidden;
    border:0;
    border-radius: 0;
}
div#level {
    font-size:2.0rem;
    padding: 0.5rem;
}
div#level span {
    border: solid #007bff 1px;
    border-radius: 50%;
    width: 2.5rem;
    max-width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    color: #666666;
    padding: 3px;
    vertical-align:middle;
}
div#level span.achieved {
    background-color: rgba(0, 123, 255, 0.76);
    color: #c6e0fb;
}
div#level span.unlocked {
    width: 3rem;
    max-width: 3rem;
    min-width: 3rem;
    height: 3rem;
    border: solid #007bff 2px;
    font-size:2.4rem;
    color: #007bff;
}
div#level span.locked {
    background-color: #999999;
    border: solid #999999 1px;
    color: #dddddd;
}
</style>
