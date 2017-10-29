<template>
  <span v-bind:class="asClass">{{value}}</span>
</template>

<script>
export default {
  props: {
    asClass: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      value: ''
    }
  },
  mounted: function () {
    this.value = this.text
  },
  watch: {
    text: function (value) {
      console.log('text changed to ' + value)
      this.value = value
    }
  }
}
</script>

<style>
</style>
