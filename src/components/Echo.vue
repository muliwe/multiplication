<template>
  <span v-bind:class="asClass">{{text}}</span>
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
  computed: {
  },
  watch: {
    text: function (value) {
      console.log('text changed to ' + value)
    }
  }
}
</script>

<style>
</style>
