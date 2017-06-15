<template>
    <div class="pageGroup">
        <div class="pageCurrent">
            <audio src="static/sound/alarm.wav" id="alarm-audio" style="display:none;"></audio>
            <div class="contents" id="content" v-html='content'></div>
        </div>
    </div>  
</template>
<style type="text/css">
  .el-message{
    max-width: 100%;
    word-wrap: break-word!important;
    top:100px;
    box-shadow:none;
  }
  .el-message p{
    width:100%;
    white-space:normal;
    text-align:center;
  }
</style>
<script type="text/javascript">
  export default {
    data(){
      return {
        content:''
      }
    },
    mounted:function(){
      $("#historyBack").css('display','none');
      $("#titleName").text('办公');
      var vueThis=this;
      var moduleUrl =requestBaseUrl + "companies/app/h5/modules";
      console.log( moduleUrl,getToken())
      $.ajax({
          url: moduleUrl,
          type: 'GET',
          async: false,
          headers: {
              'Authorization': 'Bearer ' + getToken()
          },
          success: function(response) {
              layer.closeAll();
              console.log('获取到模块：\n' + formatJSON(JSON.stringify(response)));
              if (response.status == 10001) {
                  showModules(response.data);
              } else {
                  vueThis.$message('获取模块出错' + response.status);
              }
          },
          error: function(jqXHR, status, errorThrown) {
              vueThis.$message('获取模块出错');
          }
      })

      //显示模块
      function showModules(modules) {
          var html = '<div class="content-padded grid-demo"><div class="row">';
          var menu;
          for (var i = 0; i < modules.length; i++) {
              menu = modules[i];
              html += getMenuHtml(menu.icon, menu.name, menu.url);
          }
          html += '</div></div>';
          $('#content').html(html);
          // vueThis.content=html
          addClickAndTouchOperation();
          showOrHideTakeSample();

          getWorkshops();
          setInterval(function(){
             getWorkshops();
          }, 1000 * 10); //每隔10秒获取一次状态信息，判断是否有报警
      }

      //获取角色信息并显示或隐藏采样功能
      function showOrHideTakeSample() {
          var role = getRole();
          if (role == 1 || role == 2) {
              console.log('show take sample');
              $('#take-sample').show();
          } else {
              $('#take-sample').hide();
              console.log('hide take sample');
          }
      };

      var Terminal = {
          // 辨别移动终端类型
            platform : function() {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    // 是否为iPhone或者QQHD浏览器
                    iPhone : u.indexOf('iPhone') > -1,
                    // 是否iPad
                    iPad : u.indexOf('iPad') > -1,
                    // 是否微信
                    weixin : u.toLowerCase().indexOf("micromessenger") > -1,
                    // android终端或者uc浏览器
                    android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                    // 是否WinPhone
                    wp : u.indexOf('Windows Phone') > -1
                };
            }(),
        };
      //给模块添加点击事件处理
      function addClickAndTouchOperation() {
          //处理菜单点击事件
          $('div.cell').click(function() {
              var detailUrl = $(this).find('span').text(); 
              var title=$(this).find('p').text();            
              var a=detailUrl.split('/');
              var b=a[a.length-1].split('.');
              var c=b[0];
              if (!isEmpty(detailUrl)) {
                  if (detailUrl.indexOf('http') == 0) {

                    // if (Terminal.platform.android){
                    //    if(c=='records'){                       
                    //     openWindow(projectBaseUrl+'records.html');                                          
                    //   }else{                                               
                    //     openWindow(location.href+c)
                    //     layer.open({
                    //       type:2
                    //     })
                    //   }       
                    // }else{
                      if(c=='records'){
                        location.href=projectBaseUrl+'records.html';
                         $("#historyBack").css('display',"inline-block");                                      
                      }else{                                               
                        location.href='#/'+c;
                        $("#historyBack").css('display',"inline-block")
                        layer.open({
                          type:2
                        })
                      }       
                    // }                                                          
                  } else if (detailUrl.indexOf('window.js_interface') == 0) {
                      if (window.js_interface) {
                          try {
                              eval(detailUrl); //js调用本地方法
                          } catch (e) {
                              console.log(e.toString());
                             // vueThis.$message('请在工厂宝APP上使用本功能,或者升级工厂宝APP到最新版本。', '提示');
                             layer.open({
                              content:'请在工厂宝APP上使用本功能,或者升级工厂宝APP到最新版本。'
                            })
                          }
                      } else {
                          // vueThis.$message('请在工厂宝APP上使用本功能,或者升级工厂宝APP到最新版本。', '提示');
                           layer.open({
                              content:'请在工厂宝APP上使用本功能,或者升级工厂宝APP到最新版本。'
                            });
                          // setTimeout(function(){
                          //   layer.closeAll()
                          // },1000)
                      }
                  } else {
                      vueThis.$message('出错啦');
                  }
              }
              return false;
          })

          //菜单按下时添加背景颜色
          $('.cell').on('touchstart', function() {
              $(this).css('background-color', '#dcdcdc');

          });

          //菜单不被按下时取消背景颜色
          $('.cell').bind('touchend', function() {
              $(this).css('background-color', '');
          });
      }

      //根据菜单的图片url、菜单标题、跳转url，生成一个菜单DOM
      function getMenuHtml(picUrl, title, detailUrl) {
          var str = '';
          if (title == '人脸采样') {
              str = '<div class="col-33 cell" id="take-sample">';
          } else if (title == '设备管理') {
              str = '<div class="col-33 cell" id="machine">';
              str += '<img id="machine_alert_image" src="static/images/ic_light_red.png">';
          } else {
              str = '<div class="col-33 cell">';
          }
          str += '<a href="#" id="menu-machine">';
          str += '<span hidden>' + detailUrl + '</span>';
          str += '<img src="' + picUrl + '">';
          str += '<p>' + title + '</p>';
          str += '</a>';
          str += '</div>';
          return str;
      }

      //获取车间
      function getWorkshops() {
          $.ajax({
              type: 'GET',
              url: requestBaseUrl + 'iot/companies/workshops',
              headers: {
                  'Authorization': 'Bearer ' + getToken()
              },
              success: function(response) {
                  console.log('车间信息：' + JSON.stringify(response));
                  if (response.status == 10001) {
                      if (response.data.total > 0) {
                          getWorkshopStatus(response.data.list);
                      } else {
                         vueThis.$message('没有车间信息');
                      }
                  } else {
                     vueThis.$message('获取车间信息失败' + response.status);
                  }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  vueThis.$message('加载车间列表出错' + textStatus);
              }
          })
      }

      //获取车间状态
      function getWorkshopStatus(workshopList) {
          if (workshopList == undefined || workshopList == null || workshopList.length == 0) {
              return;
          }
          $.ajax({
              type: 'GET',
              url: requestBaseUrl + 'iot/companies/machines/status',
              data: {
                  workshop_id: 0
              },
              headers: {
                  'Authorization': 'Bearer ' + getToken()
              },
              success: function(response) {
                  console.log('车间状态信息：' + JSON.stringify(response));
                  var alert = false;
                  if (response.status == 10001) {
                      var data = response.data;
                      if (data != null && data != undefined) {
                          for (var i = 0; i < workshopList.length; i++) {
                              var workshopId = workshopList[i].id;
                              var statusObj = data['' + workshopId];
                              if (statusObj != undefined) {
                                  var status = statusObj.status;
                                  if (status == -1) {
                                      alert = true;
                                  }
                              }
                          }
                      }
                  }
                  if (alert == true) {
                      //报警，显示红灯
                      $('#machine_alert_image').show();

                      try {
                          if (window.js_interface != undefined && isAlertTurnOn()) {
                              if (!Terminal.platform.android) {
                                  window.js_interface.playAlarmMusic();
                              }else {
                                  playAlarmMusic();
                              }
                          }
                      } catch(e) {
                          playAlarmMusic();
                      }
                  } else {
                      //没有报警，隐藏红灯
                      $('#machine_alert_image').hide();
                      console.error('无报警');
                  }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.log('get status error, ' + textStatus);
              }
          })
      }

      //判断报警提示音开关是否打开，默认是打开
      function isAlertTurnOn() {
          if(window.js_interface != undefined) {
              try {
                  //true对应Android，'YES'对应iOS
                  return window.js_interface.turnOnMachineAlert() == true || window.js_interface.turnOnMachineAlert() === 'YES';
              }catch(e) {
                  return true;
              }
          }
          return true;
      }

      //播放报警音效
      function playAlarmMusic() {
          try {
              document.getElementById('alarm-audio').play();
          } catch (e) {
              console.log(e);
          }
      }
    }
  }
</script>
<style type="text/css">
    .cell {
        height: 130px;
        text-align: center;
        padding-top: 15px;
    }
    
    img {
        width: 75px;
        height: 75px;
    }
    
    p {
        margin-top: 5px;
        font-size: 14px;
        color: black;
        font-weight: lighter;
    }
    
    #machine_alert_image {
        width: 25px;
        height: 25px;
        position: absolute;
        margin-left: 50px;
        display: none;
    }
    </style>
