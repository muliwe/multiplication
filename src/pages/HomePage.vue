<template>
  <main>
    <div>
      <echo as-class="test" text="2"></echo> x <echo as-class="test" text="2"></echo> = <echo as-class="test" text="4"></echo>
    </div>
  </main>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Echo from '@/components/Echo'

  export default {
    components: {
      Echo
    },
    mounted () {
    },
    computed: {
      ...mapGetters([
      ])
    },
    methods: {
      ...mapActions([
      ])
    }
  }
</script>

<style>
  main {
    height: 200px;
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
    font-size: 5rem;
    width: 80%;
    padding: 20px;
    text-align: center;
    overflow: auto;
  }
</style>
