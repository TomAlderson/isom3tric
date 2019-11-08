<template>
  <div class="container">
    <div>
      <header class="header">{{msg}}</header>
      <div id="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  }
}
</script>
