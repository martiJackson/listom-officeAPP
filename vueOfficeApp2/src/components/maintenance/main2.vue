<style type="text/css">
    .icon-operated {
        width: 35px;
        height: 35px;
    }

    .machine-name {
        font-size: 15px;
    }
    .popup{
        display: block;
    }
    #bar-nav>.el-dialog{
        height:100%;
        width:100%;
        top:0!important;
    }
</style>
<template>
    <div id="app">
        <div class="page page-current" id='router-main'>
            <header class="bar bar-nav">
                <h1 class="title">工厂宝-机床保养</h1>
            </header>
            <div class="content">
                <div class="list-block">
                    <ul>
                        <li class="item-content item-link" id="menu-maintenance-list">
                            <div class="item-inner">
                                <div class="item-title">查看所有保养项目</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="list-block">
                    <ul>
                        <li class="item-content item-link" id="menu-maintenance-detail">
                            <div class="item-inner">
                                <div class="item-title">查看单台机器保养详情</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <el-dialog
          title="提示"
          v-model="dialogVisible" id='bar-nav'>
              <div class="popup2">       
                <header class="bar bar-nav">
                    <a class="button button-link button-nav pull-left popup-back" @click='dialogVisible=false'>
                        <span class="icon icon-left"></span> 返回
                    </a>
                    <h1 class="title">选择机床</h1>
                </header>
                <div class="content">
                    <div class="content-block-title">车间列表</div>
                    <div class="list-block">
                        <ul id="workshop-list">
                            <li class="item-content item-link workshop-item" v-for='lis,index of list'  @click='workshopItem(index)' :id="lis.id" >
                                <div class="item-inner">
                                    <div class="item-title">{{lis.name}}</div>
                                    <div class="item-after">
                                        {{lis.machine_count + "台机床"}}
                                    </div>
                                </div>                           
                                <div class="row" :id='"machine-list-" + lis.id' hidden="hidden" ></div>          
                            </li> 
                                                  
                        </ul>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
    
<script type="text/javascript">
        export default {
          data(){
            return {
                list:'',
                dialogVisible:false,
                workshop_item:''
            }
        },
        methods:{
            workshopItem(index){
                this.workshop_item(index)
            }
        },
        mounted:function(){
            var vueThis=this;
             //跳转到保养列表
            $('#menu-maintenance-list').click(function() {
                window.location.href = '#/machine_maintenance_list';
            });

            //选择一台机器并跳转到保养详情
            $('#menu-maintenance-detail').click(function() {
                // $.popup($('.popup'));
                vueThis.dialogVisible=true;
                getWorkshops();
            });

            //获取车间列表
            function getWorkshops() {
                // $.showPreloader();
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/workshops',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        layer.closeAll();
                        // $.hidePreloader();
                        console.log('车间信息：' + JSON.stringify(response));
                        if (response.status == 10001) {
                            if (response.data.total > 0) {
                              var   workshopList = response.data.list;
                                showWorkshops(response.data.list);
                            } else {
                                // $.toast('没有车间信息');
                                vueThis.$message('没有车间信息')
                            }
                        } else {
                            // $.toast('获取车间信息失败' + response.status);
                            vueThis.$message('获取车间信息失败' + response.status)
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // $.hidePreloader();
                        // $.toast('加载车间列表出错');
                        vueThis.$message('加载车间列表出错')
                    }
                })
            }

            //显示车间信息
            function showWorkshops(list) {
                vueThis.list=list;
                // var data = {
                //     list: list
                // };
                // var html = template('workshop-item', data);
                // $('#workshop-list').html(html);
                vueThis.workshop_item=function(index){
                        //点击车间列表item，获取车间id，然后获取对应的机床列表
                            var workshopId = $("#workshop-list>li").eq(index).attr('id')
                           console.log(workshopId)
                            var machineNode = $('#machine-list-' + workshopId);
                            var isLoaded = machineNode.hasClass('loaded');
                            if (isLoaded) {
                                //如果已经加载了机床数据
                                if (machineNode.attr('hidden')) {
                                    machineNode.show();
                                    machineNode.removeAttr('hidden');
                                } else {
                                    machineNode.hide();
                                    machineNode.attr('hidden', 'hidden');
                                }
                            } else {
                                //如果还没加载机床数据，则加载
                                getMachinesByWorkshopId(workshopId);
                            }
                    }
                    
            }

            //根据车间id获取车间中的机床列表
            function getMachinesByWorkshopId(workshopId) {
                // $.showPreloader();
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        var html='';
                        // console.log('machine list: ' + JSON.stringify(response));
                        // $.hidePreloader();
                        if (response.status == 10001) {
                            if (response.data.total > 0) {
                                //显示某个车间中的机床
                                var list=response.data.list;
                                // showMachines(workshopId, response.data.list);
                                for(var i=0;i<list.length;i++){
                                    html+='<div class="col-50">'+
                                        '<div class="card card-machine" id="'+list[i].workshop_id + '-' +list[i].id+'">'+
                                        '<div class="card-content">'+
                                            '<div class="card-content-inner">'+
                                                '<div class="list-block">'+
                                                    '<li class="item-content">'+
                                                        '<div class="item-media"><img src="static/images/ic_operated_punch.png" class="icon-operated"></div>'+
                                                        '<div class="item-inner">'+
                                                            '<div class="item-title machine-name">'+list[i].name+'</div>'+
                                                        '</div>'+
                                                    '</li>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'
                                }
                               

                                 var machineNode = $('#machine-list-' + workshopId);
                                    machineNode.addClass('loaded');
                                    machineNode.removeAttr('hidden');
                                    machineNode.show();
                                    machineNode.html(html);
                                    addCardCss();

                            }else {
                                // $.toast('没有机床信息');
                                vueThis.$message('没有机床信息')
                            }
                        } else {
                            // $.toast('获取机床列表失败' + response.status);
                            vueThis.$message('获取机床列表失败' + response.status)
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // $.hidePreloader();
                        // $.toast('加载机床列表出错' + textStatus);
                        vueThis.$message('加载机床列表出错' + textStatus)
                    }
                })
            }

            function addCardCss() {
                //菜单按下时改变背景透明度
                $('.card-machine').bind('touchstart', function() {
                    $(this).css('opacity', '0.6');
                });

                //菜单不被按下时取消透明度
                $('.card-machine').bind('touchend', function() {
                    $(this).css('opacity', '');
                });

                //点击卡片返回到添加保养项目页面
                $('.card-machine').click(function() {
                    var idArray = $(this).attr('id').split('-');
                    var machineName = $(this).find('div.machine-name').text();
                    var workshopId = idArray[0];
                    var machineId = idArray[1];
                    // $.closeModal($('.popup'));
                    window.location.href = '#/single_machine_maintenance_detail_admin?machineId=' + machineId + '&machineName=' + encodeURIComponent(machineName);
                });
            }

            //popup窗口的返回按钮
            $('.popup-back').click(function() {
                // $.closeModal($('.popup'));
            });
        }
    }   
</script>
