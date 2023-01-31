<template>
  <div class="content">
    <router-view/>
  </div>
</template>
<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
:root{
  --bg-color: #f5f5f5;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body{
  width: 100vw;
  height: 100vh;
  background: #2c3e50;
  display: flex;
  justify-content: center;
}

.content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80vw;
  background: #ececec;
}
.separator{
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 10px 0;
}
</style>
