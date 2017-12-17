<template>
  <main>
    <progress-bar :percent="currentProgressPercent"></progress-bar>

    <div class="echo">
    <echo v-for="number in numbers[0]" :key="number.id" :text="number.value" :as-class="number.class">
    </echo><span class=sign>+</span><echo v-for="number in numbers[1]" :key="number.id" :text="number.value" :as-class="number.class">
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
  import common from '../common'
  import bModalDirective from 'bootstrap-vue/es/directives/modal/modal'
  import bBtn from 'bootstrap-vue/es/components/button/button'
  import bModal from 'bootstrap-vue/es/components/modal/modal'

  const APP = 'addition'

  const CONFIG = {
    APP: APP,
    PATH: APP,
    UNDEFINED: '…',
    BONUS_TIME: 6000,
    MAX_TIME: 15000,
    COOLDOWN: 1000,
    COOLDOWN_REVERT: 2000,
    CORRECTNESS_RATIO: 5, // one incorrect equals N correct to fix it
    LEVELS: [
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
  }
  CONFIG.MAX_LEVELS = CONFIG.LEVELS.length - 1
  CONFIG.MAX_PROGRESS = CONFIG.LEVELS.reduce((a, b) => a + b.maxProgress, 0)

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
        progress: 0, // always start from the begining of current level
        startTime: new Date().getTime(),
        errorsInSequence: 0,
        errorState: false,
        started: new Date().getTime(),
        tries: 0,
        errors: 0,
        modalText: '',
        ended: false,
        CONFIG
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

        return common.currentProgressPercent(self)
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
        common.valueChange(vm, pressed)
      },
      showModal () {
        this.$refs.myModalRef.show()
      },
      hideModal () {
        this.$refs.myModalRef.hide()
      }
    },
    mounted () {
      let self = this

      common.readSessionDataThenGenerateTask(self)

      window.scrollTo(0, document.body.scrollHeight)

      window.addEventListener('keyup', function (event) {
        // console.log(event)
        common.valueChange(self, event.key)
      })
    }
  }

</script>

<style>
</style>
