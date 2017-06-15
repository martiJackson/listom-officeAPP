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

    #last-maintenace-time {
        display: none;
    }

    .required {
        color: red;
    }
</style>
<template>
    <div id="app">
        <div class="page page-current" id='router-add-maintenance'>
            <header class="bar bar-nav addProject">
                <a class="button button-link button-nav pull-left back" @click='back'>
                    <span class="icon icon-left"></span> 返回
                </a>
                <h1 class="title">添加保养项目</h1>
            </header>
            <div class="content">
                <div class="content-block-title">添加保养项目</div>
                <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label"><span class="required">*</span>保养项目名称</div>
                                    <div class="item-input">
                                        <textarea id="maintenance-name" placeholder="请填写保养项目名称"></textarea>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id="add-maintenance-list">
                            <div class="item-content item-link">
                                <div class="item-inner">
                                    <div class="item-title"><span class="required">*</span>添加保养清单</div>
                                    <div class="item-after" id="maintenance-list-hint"></div>
                                </div>
                            </div>
                        </li>
                        <li id="select-machine">
                            <div class="item-content item-link">
                                <div class="item-inner">
                                    <div class="item-title">绑定机床</div>
                                    <div class="item-after" id="selected-machine-name"></div>
                                </div>
                            </div>
                        </li>
                        <li id="last-maintenace-time">
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">上次保养时间</div>
                                    <div class="item-input">
                                       <!--  <input type="text" placeholder="请选择上次保养时间" id="start-time-picker" class="date-picker"> -->
                                       <div class="block">
                                            <el-date-picker
                                              v-model="value2"
                                              type="date"
                                              placeholder="选择日期范围">
                                            </el-date-picker>
                                          </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">保养周期</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="请填写保养周期，单位为天" id="input-maintenance-cycle">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">保养类型</div>
                                    <div class="item-input">
                                       <!--  <input type="text" placeholder="请选择保养类型" id="maintenance-type-picker"> -->
                                       <el-select v-model="value" placeholder="请选择">
                                            <el-option
                                              v-for="item in options"
                                              :key="item.value"
                                              :label="item.label"
                                              :value="item.value">
                                            </el-option>
                                          </el-select>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">备注</div>
                                    <div class="item-input">
                                        <textarea id="remark" placeholder="请填写备注信息"></textarea>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-padded">注意：带红色*的为必填项目，未带红色*的可填可不填，若选择绑定机床，则需要填写该机床上次保养时间。</div>
                <div class="content-block">
                    <div class="row">
                        <div class="col-100"><a @click="submitMaintenance" class="button button-big button-fill button-success">提交</a></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page" id="router-add-maintenance-list" style="display:none">
            <header class="bar bar-nav">
                <a class="button button-link button-nav pull-left back" @click='back'>
                    <span class="icon icon-left"></span> 返回
                </a>
                <a class="button button-link button-nav pull-right" @click="newMaintenanceListItem">
                    <span class="icon icon-edit"></span> 新建
                </a>
                <h1 class="title">添加保养清单</h1>
            </header>
            <div class="content">
                <div class="content-block-title">保养清单</div>
                <div class="list-block">
                    <ul id="maintenance-list">
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="label">1、</div>
                                <div class="item-input">
                                    <input type="text" placeholder="输入保养内容">
                                </div>
                                <div class="item-after">
                                    <div class="item-media remove-item-btn"><i class="icon icon-remove"></i></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block">
                    <div class="row">
                        <div class="col-100"><a @click="submitList" class="button button-big button-fill button-success">提交</a></div>
                    </div>
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
                    list2:'',
                    newMaintenance:'',
                    options: [{
                      value: '选项1',
                      label: '内部保养'
                    }, {
                      value: '选项2',
                      label: '外包保养'
                    }],
                    value: '',
                    value2:'',
                    submitMaint:'',
                    submitLis:''
                }
            },
            methods:{
                back(){
                    this.$router.back(-1)
                },
                // 保养类型
                type(){
                   return this.value
                },
                timer(){
                    return this.value2
                },
                 //提交保养项目                
               submitMaintenance() {
                this.submitMaint()
                   
                },
                //新建保养清单项目
               newMaintenanceListItem() {
                     this.newMaintenance()
                },
                 //提交列表内容，保存保养清单
              submitList() {
                    this.submitLis()
                }
            },
            mounted:function(){
                layer.closeAll();
                var vueThis=this;
                 $(".icon-left").click(function(){
                    vueThis.$router.back()
                })
                 
                var timeNow = getTimeNow();
                var selectedMachineId = -1;

                // $('.date-picker').calendar({
                //     dateFormat: 'yyyy/mm/dd',
                //     value: [timeNow.yearStr + '-' + timeNow.monthStr + '-' + timeNow.dayStr]
                // });

                //选择机床
                $('#select-machine').click(function() {
                    $("#router-select-machine").css("display",'block')
                    // vueThis.$router.load("#router-select-machine");
                    getWorkshops();
                });

                //跳转到添加保养清单项页面
                $('#add-maintenance-list').click(function() {
                    // vueThis.$router.load('#router-add-maintenance-list');
                    $("#router-add-maintenance-list").css("display","block")
                });

                //删除一个保养清单条目
                $('.remove-item-btn').click(function() {
                    $(this).parents('li.item-content').remove();
                    reOrder();
                });

                //新建保养清单项目
              vueThis.newMaintenance= function() {
                    var itemSize = $('#maintenance-list').children('li').length;
                    var content = $('#maintenance-list').find('input').last().val();
                    if (content == '') {
                        // $.toast('请填写保养内容再添加新条目');
                        vueThis.$message('请填写保养内容再添加新条目')
                    } else {
                        appendNewItem(itemSize);
                    }
                }

                //追加一个新的保养条目
                function appendNewItem(currentItemSize) {
                    $('#maintenance-list').append('<li class="item-content">\
                                    <div class="item-inner">\
                                        <div class="label">' + (currentItemSize + 1) + '、</div>\
                                        <div class="item-input">\
                                            <input type="text" placeholder="输入保养内容">\
                                        </div>\
                                        <div class="item-after">\
                                            <div class="item-media remove-item-btn"><i class="icon icon-remove"></i></div>\
                                        </div>\
                                    </div>\
                                </li>');
                    $('.remove-item-btn').click(function() {
                        $(this).parents('li.item-content').remove();
                        reOrder();
                    });
                }

                //条目重新排序，按1、 2、 3的顺序
                function reOrder() {
                    var list = $('#maintenance-list').find('div.label');
                    if (list != undefined && list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            list[i].innerHTML = (i + 1) + "、";
                        }
                    }
                }

               vueThis.submitMaint=function(){
                     var data = {};
                    //保养项目名称
                    var maintenanceName = $('#maintenance-name').val();
                    if (maintenanceName == '') {
                        // $.toast('请填写保养项目名称');
                        vueThis.$message('请填写保养项目名称')
                        return;
                    }
                    data.name = maintenanceName;
                    //保养项目清单
                    if (maintenanceList.length == 0) {
                        // $.toast('请添加保养清单');
                        vueThis.$message('请添加保养清单')
                        return;
                    }
                    var maintenanceListStr = JSON.stringify(maintenanceList);
                    data.list = maintenanceListStr;
                    var lastMaintenanceTime = '';
                    //绑定机床
                    if (selectedMachineId > 0) {
                        //绑定了机床，则要求填写上次保养时间
                        lastMaintenanceTime = vueThis.timer();
                        if (lastMaintenanceTime == '') {
                            // $.toast('请选择上次保养时间');
                            vueThis.$message('请选择上次保养时间')
                            return;
                        }
                        data.last_date = parseInt(new Date(lastMaintenanceTime).getTime() / 1000, 10);
                        data.machine_id = selectedMachineId;
                    }
                    //保养周期
                    var maintenanceCycle = 0;
                    var cycle = $('#input-maintenance-cycle').val();
                    if(cycle != '') {
                        maintenanceCycle = parseInt(cycle, 10);    
                        if(isNaN(maintenanceCycle)) {
                            // $.toast('保养周期填写有误');
                           vueThis.$message('保养周期填写有误')
                            return ;    
                        }
                        data.cycle = maintenanceCycle * 24 * 60 * 60;
                    }
                    //保养类型
                    var type = vueThis.type();
                    var maintenanceType;
                    if('内部保养' === type) {
                        maintenanceType = 1;
                        data.type = 1;
                    }else if('外包保养' === type) {
                        maintenanceType = 2;
                        data.type = 2;
                    }
                    //备注
                    var remark = $('#remark').val();
                    if(remark != '') {
                        data.remark = remark;
                    }
                    $.ajax({
                        type: 'POST',
                        url: requestBaseUrl + 'iot/companies/machines/maintenances',
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        data: data,
                        success: function(response) {
                            console.log('添加保养项目返回：' + JSON.stringify(response));
                            if(response != null) {
                                if(response.status == 10001) {
                                    // $.toast('添加保养项目成功');
                                    vueThis.$message('添加保养项目成功')
                                    $("#router-add-maintenance-list").css("display","none")
                                }else {
                                    // $.toast('添加保养项目失败' + response.status);
                                   vueThis.$message('添加保养项目失败' + response.status)
                                }
                            }
                        },
                        error: function(xhr) {
                            // $.toast('添加保养项目失败' + xhr.status);
                            vueThis.$message('添加保养项目失败' + xhr.status)
                        }
                    })
                }
                var maintenanceList = [];

                vueThis.submitLis=function(){
                    var list = $('#maintenance-list').find('input');
                    if (list != undefined) {
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].value != '') {
                                maintenanceList.push(list[i].value);
                            }
                        }
                    }
                    if (maintenanceList.length == 0) {
                        // $.toast('没有添加保养清单');
                        vueThis.$message('没有添加保养清单')
                    } else {
                        $('#maintenance-list-hint').text('已添加' + maintenanceList.length + '项');
                        $("#router-add-maintenance-list").css("display","none")
                    }
                }
               

                //获取车间列表
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
                        //     $.toast('加载车间列表出错');
                        vueThis.$message('加载车间列表出错')
                        }
                    })
                }

                //显示车间信息
                function showWorkshops(list) {
                    var html='';
                    html+= '<div class="page" id="router-select-machine">'+
                                '<header class="bar bar-nav">'+
                                   '<a class="button button-link button-nav pull-left back">'+
                                        '<span class="icon icon-left"></span> 返回</a>'+
                                    '<h1 class="title">绑定机床</h1>'+
                                '</header>'+
                                '<div class="content">'+
                                   '<div class="content-block-title">车间列表</div>'+
                                    '<div class="list-block">'+
                                        '<ul id="workshop-list">'
                                           
                                        
                    for(var i=0;i<list.length;i++){
                        html+= '<li class="item-content item-link workshop-item" id='+list[i].id+'>'+
                                                '<div class="item-inner">'+
                                                    '<div class="item-title">'+list[i].name+'</div>'+
                                                    '<div class="item-after">'+
                                                        list[i].machine_count + "台机床"+
                                                   '</div>'+
                                                '</div>'+
                                            '</li>'+
                                            '<div class="row" id='+"'"+"machine-list-"+list[i].id+"'"+'hidden="hidden"></div>'
                    };
                    html+=      '</ul>'+
                            '</div>'+
                        '</div>'+
                    '</div>' 
                   
                    $("#router-add-maintenance").append(html)
                     $("#router-select-machine").css({'position':'absolute','top':0})
                     $(".pull-left").click(function(){
                        $("#router-select-machine").remove()
                         
                     })

                    $('li.workshop-item').click(function() {
                        //点击车间列表item，获取车间id，然后获取对应的机床列表
                        var workshopId = $(this).attr('id');
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
                    });
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
                                '<div class="card" id="'+list[i].workshop_id + '-' +list[i].id+'">'+
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
                    console.log(html)
                  
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
                        $('#selected-machine-name').html(machineName);
                        $('#last-maintenace-time').show();
                         $("#router-select-machine").remove()
                    });
                }
            }
        }
   
    </script>
