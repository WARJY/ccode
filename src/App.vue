<template>
  <div id="nav">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url('./assets/style/regist.scss');
@import url('./assets/style/common.scss');

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #eee;
  height: 100vh;
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
