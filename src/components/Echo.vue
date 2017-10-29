<template>
  <transition name="fade" mode="out-in">
    <span v-bind:class="asClass">{{value}}</span>
  </transition>
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
      // console.log('text changed to ' + value)
      const vm = this

      let from = Number(vm.value)
      const to = Number(value)

      if (from && to) {
        loop(from, to, vm)
      } else {
        vm.value = value
      }
    }
  }
}

function loop (from, to, vm) {
  if (from !== to) {
    if (from < to) {
      from++
    } else if (from < to) {
      from--
    } else {
      from = to
    }
    vm.value = '' + from
    setTimeout(function () {
      loop(from, to, vm)
    }, 25)
  }
}
</script>

<style>
  .fade-enter-active {
    transition: all 0.5s ease;
  }
</style>
