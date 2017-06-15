<style type="text/css">
body{
  background:#eee;;
}
.buttons-fixed{
  top:3rem;
}
.allPage{
  position: relative;
  height:100%;
  padding-top:64px;
}
.allPage>div{
  /*top: 2rem;*/
  position:relative;
  height:100%;
  overflow-x: hidden;
  margin-top: 2rem;
}
#backTitle{
  position:fixed;
  font-size:1rem!important;
  width:100%;
  /*background:#26A2FF;*/
  text-align: center;
  color:#fff;
  top:0;
  z-index: 1001;
  margin-top: 0;
  height:64px;
}
#titleContent{
  top:20px;
  position:absolute;
  width:100%;
  height:44px;
  line-height: 44px;
  z-index: 1010;
  font-size: 1.05rem;
}
#titleContent>a{
  position:absolute;
  left:0;
  height:100%;
  width:15%;
  color: #fff;
  font-weight:500;
  text-decoration: none;
  background-image:url('http://chuantu.biz/t5/103/1496986846x1902545432.png');
  background-size: 30%;
  background-repeat: no-repeat;
  background-position: 30% 50%;
}
#titleContent>span{
  position:relative;
/*  font-size:1.1rem;*/
}
#image{
  position:absolute;
  width:100%;
  left:0;
  height:64px;
}
</style>
<template>
  <div id="app" class="allPage">
<div id="backTitle">
  <img id="image" src='static/images/titleBg.png'>
  <div id="titleContent">
    <a href="JavaScript:history.back(-1)" id="historyBack"></a><span id="titleName">办公</span>
  </div>
</div>
<!-- <div style="height:64px"></div> -->
    <transition name="component-fade" mode='out-in'>
      <router-view style="margin-top:0;"></router-view> 
    </transition> 
  </div>
</template>

<script>
export default {
  import {defaults} from 'static/js/f.js'
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
  },
  mounted:function(){
  	// if (Terminal.platform.android){
   //      $("#backTitle").css('display','none');
   //  };
    $("#backTitle").height($("#image").height());

   $("#historyBack").click(function(){
    layer.open({
      type:2
    })
   })
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
}
#content{
  overflow-x: hidden;
}
body{
  overflow-y: auto;
}
/*.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .2s ease;
}*/
.component-fade-enter, .component-fade-leave-active {
  opacity: 0;
}
</style>
