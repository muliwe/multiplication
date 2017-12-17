<template>
<div class="app">
  <div class="page">
    <router-view :increment-level="incrementLevel" :current-data="currentData" :set-data="setData"></router-view>
  </div>
</div>
</template>

<script>
  export default {
    name: 'app',
    props: {
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
body {
  font-family: "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
}
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.page {
  width: 100%;
  padding: 0 0;
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
  color: #00abff;
}
div.keyboard {
  position: absolute;
  bottom: 0.5rem;
  width: 100%;
  z-index: 10;
}
div.keyboard div {
  line-height: 0.5;
}
.vue-keyboard-key {
  font-size: 2rem !important;
  padding: 1rem !important;
  background: #00abff !important;
  color: #fff !important;
  border: solid #00abff 2px !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
}
.vue-keyboard-row {
  margin-left: auto;
  margin-right: auto;
  font-size: 4rem;
}
.vue-keyboard-key:hover {
  background: #009ae6 !important;
}
.vue-keyboard-key:active, .vue-keyboard-key:focus {
  background: #00abff !important;
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
    font-size: 6rem;
    line-height: 2;
  }
  main div span {
    width: 4rem;
    max-width: 4rem;
    min-width: 4rem;
  }
  main div span.sign {
    width: 5.5rem;
    max-width: 5.5rem;
    min-width: 5.5rem;
  }
  main div span.question {
    color: #007bff;
  }
  main > div {
    padding: 6vw;
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
