<template>
  <main>
    <div>
    <echo v-for="number in numbers[0]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span>x</span><echo v-for="number in numbers[1]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span>=</span><echo v-for="number in numbers[2]" :key="number.id" :text="number.value" :as-class="number.class"></echo>
    </div>
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
              correctValue: '2',
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
              value: '2',
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
              value: '',
              correctValue: '',
              class: 'empty'
            },
            {
              id: 'n21',
              value: '4',
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
          vm.numbers[0][1].value = event.key
          vm.numbers[0][1].class = event.key === vm.numbers[0][1].correctValue ? 'correct' : 'incorrect'
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
  overflow-x: hidden;
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
  overflow-x: hidden;
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
</style>
