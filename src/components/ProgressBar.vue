<template>
  <header>
    <!--div id="level">
        <span class="achieved">0</span>
        <span class="achieved">1</span>
        <span class="unlocked">2</span>
        <span class="locked">3</span>
        <span class="locked">4</span>
    </div-->
    <div id="progressBar"><div  v-bind:style="styleObject"></div></div>
  </header>
</template>

<script>
  export default {
    props: {
      percent: {
        type: Number,
        required: true
      }
    },
    data: function () {
      return {}
    },
    computed: {
      styleObject () {
        return {
          maxWidth: this.percent + '%',
          minWidth: this.percent + '%',
          width: this.percent + '%'
        }
      }
    }
  }
</script>

<style>
  header {
    padding: 0px;
    padding-top:1rem;
    position: absolute;
    top: 0;
    font-size: 1rem;
    width:60%
  }
  div#progressBar {
    border: solid #007bff 2px;
    border-radius: 15px;
    width:100%;
    padding: 0px;
    height:1.5rem;
    margin-top:6vh;
  }
  div#progressBar div {
    color: white;
    text-align:right;
    background-color: #007bff;
    overflow-x:hidden;
    border:0;
    border-radius: 0;
    padding: 2rem 0 2rem 0;
    transition-property: width, min-width, max-width;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }
  div#level {
    font-size:2.0rem;
    padding: 0.5rem;
    margin-left: auto;
    margin-right: auto;
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

  @media screen and (max-width: 480px) and (orientation: portrait) {
    div#progressBar {
      height:5vh;
      margin-top:12vh;
    }
  }
  @media screen and (max-width: 720px) and (orientation: landscape) {
    div#progressBar {
      height:7vh;
      margin-top:12vh;
    }
  }
</style>
