<template>
  <main>
    <div>
    <echo v-for="number in numbers[0]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>×</span><echo v-for="number in numbers[1]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>=</span><echo v-for="number in numbers[2]" :key="number.id" :text="number.value" :as-class="number.class"></echo>
    </div>
    <audio ref="audioOk" src="/static/sounds/ok.wav"></audio>
    <audio ref="audioErr" src="/static/sounds/err.wav"></audio>
    <!-- https://www.audioblocks.com/royalty-free-audio/cartoon-sound-effects https://freesound.org -->
  </main>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Echo from '@/components/Echo'

  const UNDEFINED = '…'

  export default {
    components: {
      Echo
    },
    data () {
      return {
        numbers: [
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
              correctValue: '4',
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
              value: '5',
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
              value: '2',
              correctValue: '',
              class: null
            },
            {
              id: 'n21',
              value: '0',
              correctValue: '',
              class: null
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
    },
    computed: {
      ...mapGetters([
      ])
    },
    methods: {
      ...mapActions([
      ])
    },
    mounted () {
      let vm = this
      window.addEventListener('keyup', function (event) {
        // console.log(event)
        // If down arrow was pressed...
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
          for (let i = 0; i < vm.numbers.length; i++) {
            for (let j = 0; j < vm.numbers[i].length; j++) {
              const elem = vm.numbers[i][j]

              if (elem.value && elem.correctValue && elem.value !== elem.correctValue) {
                elem.value = event.key
                elem.class = event.key === elem.correctValue ? 'correct' : 'incorrect'
                vm.$refs[event.key === elem.correctValue ? 'audioOk' : 'audioErr'].play()
              }
            }
          }
        }
      })
    }
  }
</script>

<style>
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
  color: #0000ff;
}
@media screen and (max-width: 480px) and (orientation: portrait) {
    main div {
      width: 100%;
      padding:0;
    }
}
@media screen and (max-width: 720px) and (orientation: landscape) {
    main div {
      width: 90%;
    }
   main div span.question {
      color: #0000ff;
      font-size: 6.6rem;
      line-height: 10rem;
    }
}
html {
    font-size:2vw;
}
</style>
