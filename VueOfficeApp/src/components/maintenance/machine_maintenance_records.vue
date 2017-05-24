<style type="text/css">
    .icon-operated {
        width: 35px;
        height: 35px;
    }

    .machine-name {
        font-size: 15px;
    }

    .light-cell {
        text-align: center;
        padding-top: 15px;
    }

    .light-img {
        width: 45px;
        height: 45px;
    }

    .icon {
        width: 30px;
        height: 30px;
    }
    #router-select-machine{
        display: none;
    }
</style>
<template>
    <div id="app">
        <div class="page page-current" id='router'>
            <header class="bar bar-nav">
                <a class="button button-link button-nav pull-left back" @click='back'>
                    <span class="icon icon-left"></span> 返回
                </a>
                <h1 class="title">机床保养记录列表</h1>
            </header>
            <div class="content">
                <div class="list-block">
                    <ul>
                        <li class="item-content item-link" id="select-machine">
                            <div class="item-inner">
                                <div class="item-title">选择机床</div>
                                <div class="item-after" id="selected-machine-name"></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="records-content">
                </div>
            </div>
        </div>
        <div class="page" id='router-select-machine' >
            <header class="bar bar-nav">
                <a class="button button-link button-nav pull-left back" @click='hidden'>
                    <span class="icon icon-left"></span> 返回
                </a>
                <h1 class="title">选择机床</h1>
            </header>
            <div class="content">
                <div class="content-block-title">车间列表</div>
                <div class="list-block">
                    <ul id="workshop-list">
                         <li class="item-content item-link workshop-item" v-for='lis,index of list' :id="lis.id" @click='workshopItem(index)'>
                            <div class="item-inner">
                                <div class="item-title">{{lis.name}}</div>
                                <div class="item-after">
                                    {{lis.machine_count + "台机床"}}
                                </div>
                            </div>
                            <div class="row" :id='"machine-list-" + lis.id' hidden="hidden"></div>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
    
    <script type="text/javascript">
        export default {
          data(){
            return {
                list:'',
                workshop_item:''
            }
        },
        methods:{
            workshopItem(index){
                this.workshop_item(index)
            },
            hidden(){
                $("#router-select-machine").css("display",'none')
            },
            back(){
                this.$router.back()
            }
        },
        mounted:function(){
            var vueThis=this;
            var selectedMachineName;
            var selectedMachineId;

            //跳转到选择机床页面
            $('#select-machine').click(function() {
                // $.router.load('#router-select-machine');
                $('#router-select-machine').css("display","block")
                getWorkshops();
            })

            //获取机床的保养记录
            function getMachineMaintenanceRecords() {
                // $.showPreloader();
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/machines/' + selectedMachineId + '/maintenances/records',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // $.hidePreloader();
                        console.log('获取机床保养记录：' + JSON.stringify(response));
                        if (response != null) {
                            if (response.status == 10001) {
                                var size = response.data.total;
                                if (size <= 0) {
                                    // $.toast(selectedMachineName + '没有保养记录');
                                    vueThis.$message(selectedMachineName + '没有保养记录')
                                    clearRecords();
                                } else {
                                    showMachineMaintenanceRecords(response.data.list);
                                }
                            }
                        }
                    },
                    error: function(xhr) {
                        // $.hidePreloader();
                        // $.toast(selectedMachineName + '没有保养记录');
                        vueThis.$message(selectedMachineName + '没有保养记录')
                        clearRecords();
                    }
                })
            }

            //显示机床的保养记录
            function showMachineMaintenanceRecords(list) {
                if(list != null) {
                    var html = '';
                    for(var i = 0; i < list.length; i++) {
                        var listStr = '';
                        if(list[i].list != null) {
                            for(var j = 0; j < list[i].list.length; j++) {
                                listStr += list[i].list[j];
                                listStr += '<br/>';
                            }
                        }
                        listStr += '<hr style="background-color: #ececec; height: 1px; border: none;" >备注：' + list[i].remark;
                        html += '<div class="card">\
                                    <div class="card-header">' + list[i].name + '</div>\
                                    <div class="card-content">\
                                        <div class="card-content-inner">' + listStr + '</div>\
                                    </div>\
                                    <div class="card-footer">上次保养日期：' + getDateStr(list[i].day) + '</div>\
                                </div>';
                    }
                    $('#records-content').html(html);

                    //菜单按下时改变背景透明度
                    $('.card').bind('touchstart', function() {
                        $(this).css('opacity', '0.6');
                    });

                    //菜单不被按下时取消透明度
                    $('.card').bind('touchend', function() {
                        $(this).css('opacity', '');
                    });
                }
            }

            //清空记录
            function clearRecords() {
                $('#records-content').html('');
            }

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
                        // $.hidePreloader();
                        console.log('车间信息：' + JSON.stringify(response));
                        if (response.status == 10001) {
                            if (response.data.total > 0) {
                               var workshopList = response.data.list;
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
                // var data = {
                //     list: list
                // };
                // var html = template('workshop-item', data);
                // $('#workshop-list').html(html);
                vueThis.list=list;

                // $('li.workshop-item').click(function() {
                    vueThis.workshop_item=function(index){
                    //点击车间列表item，获取车间id，然后获取对应的机床列表
                    var workshopId =$(".workshop-item").eq(index).attr('id');
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
                // });
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
                        console.log('machine list: ' + JSON.stringify(response));
                        // $.hidePreloader();
                        if (response.status == 10001) {
                            if (response.data.total > 0) {
                                showMachines(workshopId, response.data.list);
                            } else {
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

            //显示某个车间中的机床
            function showMachines(workshopId, list) {
                // var data = {
                //     list: list
                // };
                // var html = template("machine-item", data);
                var html='';
                for(var i=0;i<list.length;i++){
                    html+='<div class="col-50">'+
                        '<div class="card" id="'+list[i].workshop_id + '-' + list[i].id+'">'+
                            '<div class="card-content">'+
                                '<div class="card-content-inner">'+
                                    '<div class="list-block">'+
                                        '<li class="item-content">'+
                                            '<div class="item-media"><img src="/static/images/ic_operated_punch.png" class="icon-operated"></div>'+
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
            }

            function addCardCss() {
                //菜单按下时改变背景透明度
                $('.card').bind('touchstart', function() {
                    $(this).css('opacity', '0.6');
                });

                //菜单不被按下时取消透明度
                $('.card').bind('touchend', function() {
                    $(this).css('opacity', '');
                });

                //点击卡片返回到添加保养项目页面
                $('.card').click(function() {
                    var idArray = $(this).attr('id').split('-');
                    var machineName = $(this).find('div.machine-name').text();
                    var workshopId = idArray[0];
                    var machineId = idArray[1];
                    selectedMachineId = parseInt(machineId, 10);
                    selectedMachineName = machineName;
                    $('#selected-machine-name').html(machineName);
                    // vueThis.$router.back();
                    $("#router-select-machine").css("display",'none')
                    getMachineMaintenanceRecords();
                });
            }
        }
    }
    
    </script>
