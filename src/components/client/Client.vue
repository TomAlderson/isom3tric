<template>
  <div class="container">
    <div id="content"></div>
  </div>
</template>

<script>
import Game from '../../game'

export default {
  name: 'hotel-view',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  created() {
    window.game = new Game()
  },
  destroyed() {
    window.game.destroy()
  },
  methods: {},
}
</script>
