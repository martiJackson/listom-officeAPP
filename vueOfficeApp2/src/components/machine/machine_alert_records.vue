<template>
    <div id="app">
         <div class="content" id="content">
            <div class="content-block-title">机床报警列表</div>
            <div class="list-block">
                <ul id="list">
                    <li class="item-content item-link" v-for='lis,index of list' :id='lis.id' @click='machineAlertDetail(index)'>
                        <div class="item-media"><i class="icon icon-f7"></i></div>
                        <div class="item-inner">
                            <div class="item-title">{{lis.time}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
    <script type="text/javascript">
        export default {
                data(){
                  return {
                    list:'',
                    fn:''
                  }
              },
              methods:{
                machineAlertDetail(index){
                    this.fn(index)
                }
              },
              mounted:function(){
                $("#titleName").text('机床报警记录');
                var vueThis=this;
                var machineId =getUrlParam('id');

                getMachineAlertRecords(machineId);

                //获取报警记录
                function getMachineAlertRecords(machineId) {
                    $.ajax({
                        type: 'GET',
                        url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/alert/records',
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        success: function(response) {
                            layer.closeAll();
                            console.log('get machine alert records: ' + formatJSON(JSON.stringify(response)));
                            if (response.status == 10001) {
                                if(response.data.total > 0) {
                                    var list = response.data.list;
                                    $('div.content-block-title').html('机床报警列表（' + response.data.total + '条）');
                                    showAlertList(list);
                                }else {
                                    $('div.content-block-title').html('机床报警列表（0条）');
                                }
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                        }
                    })
                }

                //显示报警列表
                function showAlertList(list) {
                    for(var i=0;i<list.length;i++){
                        list[i].time=getTimeStr(list[i].time)
                    }
                    vueThis.list=list
                    vueThis.fn=function(index) {
                        //跳转到报警详情
                        window.location.href = '#/machine_alert_detail?machineId=' + machineId + '&alertId=' + $('#list>li').eq(index).attr('id');
                    }
                }
              }
          }
    
    </script>

