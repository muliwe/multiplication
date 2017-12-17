<template>
  <b-navbar type="light" fixed="top" toggleable>
    <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_dropdown_collapse">
      <b-navbar-nav class="ml-auto">
        <!-- Navbar dropdowns -->
        <b-nav-item-dropdown text="Тренажёры" right>
          <b-dropdown-item href="#/multiplication/" v-bind:class="multiplicationClass">Умножение</b-dropdown-item>
          <b-dropdown-item href="#/addition/" v-bind:class="additionClass">Сложение</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  export default {
    props: {
      currentAppUrl: {
        type: String,
        required: false
      }
    },
    data: function () {
      return {
        value: ''
      }
    },
    mounted: function () {
    },
    watch: {
    },
    computed: {
      multiplicationClass () {
        return this.currentAppUrl === 'multiplication' ? 'selected' : ''
      },
      additionClass () {
        return this.currentAppUrl === 'addition' ? 'selected' : ''
      }
    }
  }
</script>

<style>
nav div {
  font-size: 1rem;
  text-align: left;
  overflow: visible;
}

nav div span {
  display: inline-block;
  width: 6rem;
  max-width: 6rem;
  min-width: 6rem;
  overflow: hidden;
}

nav a.selected {
  font-weight: 500;
}
</style>
