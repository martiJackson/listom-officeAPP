<style type="text/css">
    .content-block {
        padding: 0;
    }

    .tab-page {
        margin-top: 2.5rem;
    }

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
</style>
<template>
    <div id="app">
         <div class="page page-current" id='router'>
            <header class="bar bar-nav">
                <a style="display: none;" class="icon icon-edit pull-left" id="edit-left-btn" href="single_machine_maintenance_detail.html?machineId=1&machineName=CNC-25"></a>
                <a class="icon icon-edit pull-right" id="edit-right-btn" href="http://localhost:8080/#machine_maintenance_add"></a>
                <h1 class="title">工厂宝-机床保养</h1>
            </header>
            <div class="content">
                <div id="tab-header" class="buttons-tab fixed-tab buttons-fixed">
                    <a href="#tab1" class="tab-link active button">保养项目列表</a>
                    <a href="#tab2" class="tab-link button">保养历史记录</a>
                </div>
                <div class="content-block">
                    <div class="tabs">
                        <div id="tab1" class="tab active tab-page">
                            <div class="content-block" id="tab1-content">
                                <div class="card card-maintenance-item" v-for='lis,index of list'>
                                    <div class="card-header">
                                        <span>{{lis.name}}</span>
                                        <span><img src="static/images/ic_light_red.png" class="light-img" style="display: none;"></span>
                                    </div>
                                    <div class="card-content">
                                        <div class="card-content-inner">
                                            <div>{{lis.list}}</div>
                                            <hr style="background-color: #ececec; border: none; height: 1px;" /> 备注：
                                            <br/>{{lis.remark}}
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <span>保养周期：{{lis.cycle}}</span>
                                        <span><button class="button button-success button-fill" style="display: none;">确认已保养</button></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab2" class="tab tab-page">
                            <div class="content-block">
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
                    </div>
                </div>
            </div>
        </div>
        
        <el-dialog
              title="提示"
              v-model="dialogVisible"
             id="bar-nav">
             <div class="popup3 popup-about">
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
                                <li class="item-content item-link workshop-item" v-for='lis2,index of list2' @click='workshopItem(index)' :id="lis2.id">
                                    <div class="item-inner">
                                        <div class="item-title">{{lis2.name}}</div>
                                        <div class="item-after">
                                            {{lis2.machine_count + "台机床"}}
                                        </div>
                                    </div> 
                                    <div class="row" :id='"machine-list-" + lis2.id' hidden="hidden"></div>
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
                    list2:'',
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
                //切换tab时隐藏或显示右边的编辑按钮
                $('.tab-link').click(function() {
                    var id = $(this).attr('href');
                    var editBtn = $('#edit-right-btn');
                    if (id === '#tab1') {
                        editBtn.show();
                    } else {
                        editBtn.hide();
                    }
                });

                getMaintenanceList();
                //获取保养列表
                function getMaintenanceList() {
                    // $.showPreloader();
                    $.ajax({
                        type: 'GET',
                        url: requestBaseUrl + 'iot/companies/machines/maintenances',
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        success: function(response) {
                            layer.closeAll();
                            // $.hidePreloader();
                            if (response.status == 10001) {
                                var data = response.data.list;
                                if (data != null && data.length > 0) {
                                    showMaintenanceList(data);
                                } else {
                                    // $.toast('暂无保养项目');
                                    vueThis.$message('暂无保养项目')
                                }
                            } else {
                                // $.toast('加载保养列表出错' + response.status);
                                vueThis.$message('加载保养列表出错' + response.status)
                            }
                        },
                        error: function(xhr) {
                            // $.hidePreloader();
                            // $.toast('加载保养列表出错' + xhr.status);
                            vueThis.$message('加载保养列表出错' + xhr.status)
                        }
                    })
                }

                //显示保养项目列表
                function showMaintenanceList(data) {
                    // template.config('escape', false);
                    // template.helper('getCycleStr', getCycleStr);
                    // template.helper('getMaintenanceManifest', getMaintenanceManifest);
                    // var data = {
                    //     list: data
                    // };
                    // var html = template('maintenance-item', data);
                    for(var i=0;i<data.length;i++){
                        data[i].list=getMaintenanceManifest( data[i].list)
                        data[i].cycle=getCycleStr(data[i].cycle)
                    }
                    vueThis.list=data
                    // $('#tab1-content').html(html);

                    //点击某个保养项，出现操作对话框
                    $('.card-maintenance-item').click(function() {

                    });
                }

                //周期转换，unix时间戳转字符串，最后的结果是天
                function getCycleStr(unixTime) {
                    return parseInt(unixTime / (24 * 60 * 60), 10) + "天";
                }

                //获取保养清单
                function getMaintenanceManifest(list) {
                    if (list == null) {
                        return "暂无保养清单";
                    }
                    var str = '保养清单：\n';
                    for (var i = 0; i < list.length; i++) {
                        str += list[i].name;
                        if (i != list.length - 1) {
                            str += '\n';
                        }
                    }
                    return str;
                }

                /*********************************************************************************/

                var selectedMachineName;
                var selectedMachineId;

                //跳转到选择机床页面
                $('#select-machine').click(function() {
                    // $.popup($('.popup'));
                    vueThis.dialogVisible=true
                    getWorkshops();
                })

                //popup窗口的返回按钮
                $('.popup-back').click(function() {
                    // $.closeModal($('.popup'));
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
                                        clearRecords();
                                        $('#records-content').html('<div style="text-align: center;">' + selectedMachineName + '没有保养记录</div>');
                                    } else {
                                        showMachineMaintenanceRecords(response.data.list);
                                    }
                                }
                            }else {
                                // $.toast('records null');
                                vueThis.$message('records null')
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
                    if (list != null) {
                        var html = '';
                        for (var i = 0; i < list.length; i++) {
                            var listStr = '';
                            if (list[i].list != null) {
                                for (var j = 0; j < list[i].list.length; j++) {
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
                        // $('.card').bind('touchstart', function() {
                        //     $(this).css('opacity', '0.6');
                        // });

                        // //菜单不被按下时取消透明度
                        // $('.card').bind('touchend', function() {
                        //     $(this).css('opacity', '');
                        // });
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
                     vueThis.list2=list;

                    // $('li.workshop-item').click(function() {
                         vueThis.workshop_item=function(index){
                        //点击车间列表item，获取车间id，然后获取对应的机床列表
                        // var workshopId = $(this).attr('id');
                         var workshopId = $("#workshop-list>li").eq(index).attr('id')
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
                        return false
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

                    var html=''
                    for(var i=0;i<list.length;i++){
                        html+='<div class="col-50">'+
                            '<div class="card card-machine" id="'+list[i].workshop_id + '-' +list[i].id+'">'+
                                '<div class="card-content">'+
                                    '<div class="card-content-inner">'+
                                       ' <div class="list-block">'+
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
                }

                function addCardCss() {
                    // 菜单按下时改变背景透明度
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
                        selectedMachineId = parseInt(machineId, 10);
                        selectedMachineName = machineName;
                        $('#selected-machine-name').html(machineName);
                        vueThis.dialogVisible=false;
                        // $.closeModal($('.popup'));
                        getMachineMaintenanceRecords();
                    });
                }
            }
        }   
    </script>
