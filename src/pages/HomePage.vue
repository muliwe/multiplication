<template>
  <main>
    <div>
      <echo as-class="test" :text="x"></echo> x <echo as-class="test" text="2"></echo> = <echo as-class="test" text="4"></echo>
    </div>
	<!--div>
		<span id=n1>0</span><span id=x1 class="correct">2</span><span id=y1 class="empty"></span><span>x</span><span id=n2>2</span><span id=x2 class="empty"></span><span id=y2 class="empty"></span><span>=</span><span id=n3>2</span><span id=x3>4</span><span id=y3 class="empty"></span>
	</div>
	<div>
		<span id=n1>1</span><span id=x1 class="incorrect">2</span><span id=y1 class="empty"></span><span>x</span>
		<span id=n2>2</span><span id=x2></span><span id=y2 class="empty"></span> =
		<span id=n3>2</span><span id=x3>4</span><span id=y3 class="empty"></span>
	</div>
	<div>
		<span id=n1>1</span><span id=x1 class="question">…</span><span id=y1 class="empty"></span><span>x</span><span id=n2>2</span><span id=x2 class="empty"></span><span id=y2 class="empty"></span> <span>=</span><span id=n3>2</span><span id=x3>4</span><span id=y3 class="empty"></span>
	</div-->
  </main>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Echo from '@/components/Echo'

  export default {
    components: {
      Echo
    },

    data () {
      return {
        x: '...'
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
        console.log(event)
        // If down arrow was pressed...
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
          vm.x = event.key
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
  /*text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);*/
  font-family: "Roboto", Arial;
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
  width: 0rem;
  max-width: 0rem;
  min-width: 0rem;
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
