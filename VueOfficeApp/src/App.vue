
<template>
  <div id="app">
   <!--  <img src="./assets/logo.png">
    <router-link to="/index">index</router-link> -->
    <transition name="component-fade" mode='out-in'>
      <router-view></router-view> 
    </transition> 
  </div>
</template>

<script>
export default {
  data(){
    return {
      ID:'2',
      workshopId:'一车间',
      machineId:'',
      machineName:'机器1-6',
      hasPermission:'',
      alertId:'',
      machineCount:'',
      workshopName:'',
      maintenanceId:'',
      hasPermission:'',
      modify_machine_picture:false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#content{
  overflow-x: hidden;
}
body{
  overflow-y: auto;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-active {
  opacity: 0;
}
</style>
