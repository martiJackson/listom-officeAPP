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
        width: 20px;
        height: 20px;
        margin-top: 5px;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

    .tab-page {
        margin-top: 2.5rem;
    }

    .content-block {
        padding: 0;
    }

    .remark {
        font-size: 14px;
    }

    .list-block-small-text {
        font-size: .7rem;
    }

    .swiper-img {
        width: 12rem;
        height: 8rem;
    }

    .swiper-container {
        padding-bottom: 0;
    }

    #page-hint {
        margin-top: 10px;
    }
    .popup-about{
        position: fixed;
        transition:all .5s linear;
        top:100%;
        left:0;
    }
</style>
<template>
    <div id="app">
        <div class="page page-current" id='router'>
            <header class="bar bar-nav">
                <a class="button button-link button-nav pull-left back">
                    <span class="icon icon-left"></span> 返回
                </a>
                <h1 class="title title-main">机床保养详情</h1>
            </header>
            <div class="content">
                <div class="buttons-tab fixed-tab buttons-fixed">
                    <a href="#tab1" class="tab-link button active" id="tab-header1">已绑定保养项</a>
                    <a href="#tab2" class="tab-link button" id="tab-header2">未绑定保养项</a>
                    <a href="#tab3" class="tab-link button" id="tab-header3">历史保养记录</a>
                </div>
                <div class="tabs">
                    <div id="tab1" class="tab active">
                        <div class="content-block tab-page-block tab-page" id="tab-page-binded-list">
                        </div>
                    </div>
                    <div id="tab2" class="tab">
                        <div class="content-block tab-page-block tab-page" id="tab-page-unbinded-list">
                        </div>
                    </div>
                    <div id="tab3" class="tab">
                        <div class="content-block tab-page-block tab-page" id="tab-page-history-list">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 这是popupwindow的布局 -->
        <div class="popup popup-about" >
            <header class="bar bar-nav">
                <a class="button button-link button-nav pull-left close-popup" >
                    <span class="icon icon-left"></span> 返回
                </a>
                <h1 class="title">绑定保养项</h1>
            </header>
            <div class="content">
                <div class="content-padded">
                    绑定保养项目前，需要填写机床的保养周期、保养类型和上次保养时间，请填写下面的表格然后提交。
                </div>
                <div class="content-block-title" id="pop-list-title"></div>
                <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">保养周期</div>
                                    <div class="item-input">
                                        <input type="text" id="pop-cycle" placeholder="输入保养周期，单位：天">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">保养类型</div>
                                    <div class="item-input">
                                        <!-- <input type="text" id="pop-type" placeholder="选择保养类型"> -->
                                        <el-select v-model="value2" id="pop-type" placeholder="选择保养类型">
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
                                    <div class="item-title label">上次保养时间</div>
                                    <div class="item-input">
                                        <input type="text" id="pop-last-time" placeholder="上次保养时间">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block">
                    <div class="row">
                        <div class="col-50"><a class="close-popup button button-big button-fill button-danger">取消</a></div>
                        <div class="col-50"><a class="button button-big button-fill button-success" id="pop-commit-btn">提交</a></div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
          title="提示"
          v-model="dialogVisible">
          <span>确定要解除绑定该保养项吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click='handle'>确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="提示" v-model="dialog" class="popup-group" size='large'>
            <header class="bar bar-nav">
              <button class="button button-link button-nav pull-left close-popup" id="close-pop-btn" @click='dialog=false'>
                关闭
              </button>
              <h1 class="title" id="popup-title"></h1>
            </header>
            <div class="block">
                <span class="demonstration">查看图片</span>
                <el-carousel height="150px">
                  <el-carousel-item v-for="item in value" :key="item">
                    <h3><img :src='item' class="showPhoto"></h3>
                  </el-carousel-item>
                </el-carousel>
            </div>
        </el-dialog>
    </div>
</template>  
    <script type="text/javascript">
        export default {
              data(){
                return {
                    fn:'',
                    value:'',
                    dialog:false,
                    dialogVisible:false,
                     options: [{
                      value: '内部保养',
                      label: '内部保养'
                    }, {
                      value: '外部保养',
                      label: '外部保养'
                    }],
                    value2: ''
                }
            },
            methods:{
                handle(){
                    this.fn()
                },
                handle2(){

                }
            },
            mounted:function(){
                var vueThis=this;
                var selectedMachineName = getUrlParam('machineName');
                var selectedMachineId =  getUrlParam('machineId');

                var bindedList = []; //已绑定的保养项目
                var unbindedList = []; //未绑定的保养项目
                var allList = []; //所有保养项目

                var historyRecords; //历史保养记录
                var selectedBindedMaintenanceId; //选中的待绑定的保养项ID
                var selectedBindedMaintenanceNode; //选中的待绑定的DOM节点

                $('title').text(selectedMachineName + '保养详情');
                $('title-main').text(selectedMachineName + '保养详情');
                $('#pop-list-title').text(selectedMachineName + '绑定保养项');

                getMachineBindedMaintenance();

                //获取机床已绑定的保养项
                function getMachineBindedMaintenance() {
                    // $.showPreloader();
                    $.ajax({
                        type: 'GET',
                        url: requestBaseUrl + 'iot/companies/machines/' + selectedMachineId + '/maintenances',
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        success: function(response) {
                            layer.closeAll();
                            // $.hidePreloader();
                            console.log('获取已绑定的保养项：\n' + formatJSON(JSON.stringify(response)));
                            if (response != null) {
                                if (response.status == 10001) {
                                    var size = response.data.total;
                                    if (size <= 0) {
                                        $('#tab-page-binded-list').html('<div style="text-align: center;">' + selectedMachineName + '没有绑定的保养项</div>');
                                        clearRecords();
                                    } else {
                                        bindedList = [];
                                        for (var i = 0; i < size; i++) {
                                            bindedList.push(response.data.list[i]);
                                        }
                                        showMachineBindedMaintenance(bindedList);
                                    }
                                }
                            }
                        },
                        error: function(xhr) {
                            // $.hidePreloader();
                            // $.toast('查询保养项出错' + xhr.status);
                            vueThis.$message('查询保养项出错' + xhr.status)
                            clearRecords();
                        }
                    })
                }

                //根据上次保养日期和周期，返回灯的状态
                function getLightStatus(lastDate, cycle) {
                    var now = parseInt(new Date().getTime() / 1000);
                    var nextTime = lastDate + cycle;
                    if (now >= nextTime) {
                        //现在时间大于下次保养时间，则红灯
                        return '<img class="light-img" src="static/images/ic_light_red.png">';
                    } else if ((7 * 24 * 60 * 60 + now) >= nextTime) {
                        //现在时间加上15天大于下次保养时间，则接近保养日期，黄灯
                        return '<img class="light-img" src="static/images/ic_light_yellow.png">';
                    }
                    //没到保养日期，绿灯
                    return '<img class="light-img" src="static/images/ic_light_green.png">';
                }

                //显示机床已绑定的保养项
                function showMachineBindedMaintenance(list) {
                    if (list != null) {
                        var html = '<div class="content-padded remark"><p>备注：<img class="light-img" src="static/images/ic_light_red.png">表示已到保养日期，<img class="light-img" src="static/images/ic_light_yellow.png">表示接近保养日期（下次保养日期前7天），<img class="light-img" src="static/images/ic_light_green.png">表示还未到下次保养日期。</p></div>';
                        for (var i = 0; i < list.length; i++) {
                            var cardContent = '<div class="list-block list-block-small-text"><ul>';
                            if (list[i].list != null) {
                                for (var j = 0; j < list[i].list.length; j++) {
                                    cardContent += '<li class="item-content item-link">\
                                                    <div class="item-inner manifest-item" id="' + list[i].list[j].id + '-' + list[i].list[j].maintenance_id + '">\
                                                        <div class="item-title">' + list[i].list[j].name + '</div>\
                                                        <div class="manifest-item-pics" style="display: none">' + list[i].list[j].pics + '</div>\
                                                    </div>\
                                                    </li>';
                                }
                            }
                            cardContent += '<li class="item-content">\
                                            <div class="item-inner">\
                                                <div class="item-title">备注：' + list[i].remark + '</div>\
                                            </div>\
                                            </li>';
                            cardContent += '<li class="item-content">\
                                            <div class="item-inner">\
                                                <div class="item-title">上次保养日期：' + getDateStr(list[i].last_date) + '</div>\
                                            </div>\
                                            </li>';
                            cardContent += '<li class="item-content">\
                                            <div class="item-inner">\
                                                <div class="item-title">下次保养日期：' + getDateStr(list[i].last_date + list[i].cycle) + '</div>\
                                            </div>\
                                            </li>';
                            cardContent += '</ul></div>';
                            html += '<div class="card card-binded" id="card-' + list[i].id + '">\
                                        <div class="card-header">\
                                            <span>' + list[i].name + '</span>\
                                            <span>' + getLightStatus(list[i].last_date, list[i].cycle) + '</span>\
                                        </div>\
                                        <div class="card-content">\
                                            <div class="card-content-inner">' + cardContent + '</div>\
                                        </div>\
                                        <div class="card-footer"><span>保养周期：' + parseInt(list[i].cycle / (24 * 60 * 60), 10) + '天</span>\
                                            <span id="' + list[i].id + '"><button  id="unbindBtn"  class="button button-fill button-danger">解除绑定</button></span>\
                                        </div>\
                                    </div>';
                        }
                        $('#tab-page-binded-list').html(html);
                        //解除绑定
                            $("#unbindBtn").click(function(){
                                vueThis.dialogVisible=true;
                                var maintenanceId = $(this).parent().attr('id');
                                var node = $('#card-' + maintenanceId);
                                // $.confirm('确定要解除绑定该保养项吗？', '提示', function() {
                                //     unbindMaintenance(maintenanceId, node);
                                // });
                                vueThis.fn=function(){
                                    vueThis.dialogVisible=false;
                                    unbindMaintenance(maintenanceId, node);
                                }
                            });

                        $('.manifest-item').click(function() {
                            var id = $(this).attr('id');
                            var pics = $(this).children('.manifest-item-pics').text();
                            console.log('pics = ' + pics);
                            var textHTML = [];
                            if(pics === 'null') {
                                textHTML.push('static/images/empty_img.png');
                            }else {
                                var picsArr = pics.split(',');
                                for(var i = 0; i < picsArr.length; i++) {
                                    textHTML.push("https://img.listome.com" + picsArr[i])
                                }
                            }
                            vueThis.dialog=true;
                            vueThis.value=textHTML;
                        });
                    } else {
                        $('#tab-page-binded-list').html('<div>暂无未绑定的保养项目</div>');
                    }
                }

                //获取所有的保养项目
                function getAllMaintenance() {
                    // $.showPreloader();
                    $.ajax({
                        type: 'GET',
                        url: requestBaseUrl + 'iot/companies/machines/maintenances',
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        success: function(response) {
                            // $.hidePreloader();
                            if (response.status == 10001) {
                                if (response.data.list != null) {
                                    allList = [];
                                    for (var i = 0; i < response.data.list.length; i++) {
                                        allList.push(response.data.list[i]);
                                    }
                                }
                                showUnbindedList();
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

                //显示未绑定的保养项
                function showUnbindedList() {
                    if (allList == null || allList.length == 0) {
                        $('#tab-page-unbinded-list').html('<div style="text-align: center;">暂无未绑定的保养项目</div>')
                        return;
                    }
                    if (bindedList == null) {
                        unbindedList = allList;
                    } else {
                        unbindedList = [];
                        for (var i = 0; i < allList.length; i++) {
                            if (!isBinded(allList[i])) {
                                unbindedList.push(allList[i]);
                            }
                        }
                    }
                    if (unbindedList == null || unbindedList.length == 0) {
                        $('#tab-page-unbinded-list').html('<div style="text-align: center;">暂无未绑定的保养项目</div>')
                        return;
                    }
                    //显示未绑定的列表
                    console.log('unbinded list: \n' + formatJSON(JSON.stringify(unbindedList)));
                    var html = '';
                    for (var i = 0; i < unbindedList.length; i++) {
                        var listStr = '';
                        if (unbindedList[i].list != null) {
                            for (var j = 0; j < unbindedList[i].list.length; j++) {
                                listStr += unbindedList[i].list[j].name;
                                listStr += '<br/>';
                            }
                        }
                        html += '<div class="card card-unbinded" id="card-' + unbindedList[i].id + '">\
                                    <div class="card-header"><span>' + unbindedList[i].name + '</span>\
                                        <span id="' + unbindedList[i].id + '">\
                                            <button class="bindBtnClick"  class="button button-fill button-success">绑定</button>\
                                        </span>\
                                    </div>\
                                    <div class="card-content">\
                                        <div class="card-content-inner">' + listStr + '</div>\
                                    </div>\
                                    <div class="card-footer">备注：' + unbindedList[i].remark + '</div>\
                                </div>';
                    }
                    $('#tab-page-unbinded-list').html(html);
                    //绑定保养项到机床
                   $(".bindBtnClick").click(function() {
                    $(".popup-about").css({'top':'-100%'})
                        selectedBindedMaintenanceId = $(this).parent().attr('id');
                        selectedBindedMaintenanceNode = $('#card-' + selectedBindedMaintenanceId);
                        //清空表单
                        $('#pop-cycle').val('');
                        vueThis.value='';
                        $('#pop-last-time').val('');
                        vueThis.value2='';
                        // $.popup($('.popup'));
                    }) 
                   $('.close-popup').click(function(){
                    $(".popup-about").css({'top':0})
                   })
                }

                

                //绑定保养项到某台机器
                function bindMaintenanceToMachine(data) {
                    // $.showPreloader();
                    $.ajax({
                        type: 'POST',
                        url: requestBaseUrl + 'iot/companies/machines/' + selectedMachineId + '/maintenances/' + selectedBindedMaintenanceId,
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        data: data,
                        success: function(response) {
                            // $.hidePreloader();
                            if (response != null && response.status == 10001) {
                                // $.toast('绑定成功');
                                vueThis.$message('绑定成功')
                                //删除dom节点
                                selectedBindedMaintenanceNode.remove();
                                //修改数组
                                setItemBinded(selectedBindedMaintenanceId, data);
                            } else if (response.status == 40001) {
                                // $.toast('绑定失败，该保养项目已绑定');
                                vueThis.$message('绑定失败，该保养项目已绑定')
                            }
                        },
                        error: function(xhr) {
                            // $.hidePreloader();
                            // $.toast('绑定保养项目到机床失败' + xhr.status);
                            vueThis.$message('绑定保养项目到机床失败' + xhr.status)
                        }
                    })
                }

                //解除绑定保养项
                function unbindMaintenance(maintenanceId, node) {
                    // $.showPreloader();
                    $.ajax({
                        type: 'DELETE',
                        url: requestBaseUrl + 'iot/companies/machines/' + selectedMachineId + '/maintenances/' + maintenanceId,
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        success: function(response) {
                            // $.hidePreloader();
                            if (response != null && response.status == 10001) {
                                // $.toast('解除绑定成功');
                                vueThis.$message('解除绑定成功')
                                node.remove();
                                setItemUnbinded(maintenanceId);
                            } else {
                                // $.toast('解除绑定失败');
                                vueThis.$message('解除绑定失败')
                            }
                        },
                        error: function(xhr) {
                            // $.hidePreloader();
                            // $.toast('解除绑定失败' + xhr.status);
                            vueThis.$message('解除绑定失败' + xhr.status)
                        }
                    })
                }

                //判断一个保养项目是否在绑定的列表中
                function isBinded(obj) {
                    if (bindedList == undefined || bindedList == null || bindedList.length == 0) {
                        return false;
                    }
                    for (var i = 0; i < bindedList.length; i++) {
                        if (bindedList[i].id == obj.id) {
                            return true;
                        }
                    }
                    return false;
                }

                //设置某一项被绑定，则需要从unbindedList中去除，并添加到bindedList中
                function setItemBinded(id, data) {
                    //遍历unbindedList
                    var item;
                    for (var i = 0; i < unbindedList.length; i++) {
                        if (id == unbindedList[i].id) {
                            item = unbindedList[i];
                            unbindedList.splice(i, 1);
                        }
                    }
                    if (item != null && item != undefined) {
                        item.last_date = data.last_date;
                        item.cycle = data.cycle;
                        bindedList.push(item);
                    }
                }

                //设置某一项取消绑定，则需要从bindedList中去除，并添加到unbindedList中
                function setItemUnbinded(id) {
                    var item;
                    for (var i = 0; i < bindedList.length; i++) {
                        if (id == bindedList[i].id) {
                            item = bindedList[i];
                            bindedList.splice(i, 1);
                        }
                    }
                    if (item != null && item != undefined) {
                        unbindedList.push(item);
                    }
                }

                //切换tab时的处理
                $('.tab-link').click(function() {
                    var tabId = $(this).attr('id');
                    if (tabId == 'tab-header1') { //显示绑定的保养项
                        if (bindedList != undefined && bindedList != null && bindedList.length > 0) {
                            //直接显示已有的数据
                            showMachineBindedMaintenance(bindedList);
                        } else {
                            //从服务端获取
                            getMachineBindedMaintenance();
                        }
                    } else if (tabId == 'tab-header2') { //显示未绑定的保养项
                        if (allList == null || allList.length == 0) {
                            getAllMaintenance();
                        } else {
                            showUnbindedList();
                        }
                    } else if (tabId == 'tab-header3') { //显示历史保养记录
                        if (historyRecords == undefined || historyRecords == null) {
                            getMaintenanceRecords();
                        } else {
                            showMaintenanceRecords(historyRecords);
                        }
                    }
                })

                //获取历史保养记录
                function getMaintenanceRecords() {
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
                                        $('#tab-page-history-list').html('<div style="text-align: center;">' + selectedMachineName + '没有保养记录</div>');
                                    } else {
                                        historyRecords = response.data.list;
                                        showMaintenanceRecords(historyRecords);
                                    }
                                }
                            }
                        },
                        error: function(xhr) {
                            // $.hidePreloader();
                            $('#tab-page-history-list').html('<div style="text-align: center;">' + selectedMachineName + '没有保养记录</div>');
                            clearRecords();
                        }
                    })
                }

                //显示保养记录
                function showMaintenanceRecords(list) {
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
                                        <div class="card-footer" id="maintenance-person-' + i + '-' + list[i].user_id + '">保养人：</div>\
                                    </div>';
                        }
                        $('#tab-page-history-list').html(html);

                        for (var i = 0; i < list.length; i++) {
                            var userId = list[i].user_id;
                            showUserNameById(userId, $('#maintenance-person-' + i + '-' + userId));
                        }
                    }
                }

                function showUserNameById(user_id, node) {
                    var arr = [];
                    arr.push(user_id);
                    $.ajax({
                        type: 'GET',
                        url: requestBaseUrl + 'companies/users/names',
                        data: {
                            user_ids: JSON.stringify(arr)
                        },
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        success: function(response) {
                            if (response.status == 10001) {
                                var nameArr = response.data.names;
                                if (nameArr.length > 0) {
                                    node.text('保养人：' + nameArr[0]);
                                }
                            }            
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                        }
                    })
                }

                //清空记录
                function clearRecords() {
                    $('#records-content').html('');
                }
                var timeNow = getTimeNow();
               $('#pop-last-time').click(function(){
                $(this).val(timeNow.yearStr + '-' + timeNow.monthStr + '-' + timeNow.dayStr);
               })

                $('#pop-commit-btn').click(function() {
                    var cycle = $("#pop-cycle").val();
                    var type = vueThis.value2;
                    var lastTime = $('#pop-last-time').val();
                    var data = {};
                    console.log(cycle+'+'+type+'+'+lastTime)
                    if (cycle ==='') {
                        // $.toast('请填写保养周期');
                        // vueThis.$message('请填写保养周期')
                        layer.open({
                            content:'请填写保养周期'
                        })
                        return;
                    }
                    if (isNaN(cycle)) {
                        // $.toast('保养周期填写有误');
                        // vueThis.$message('保养周期填写有误')
                        layer.open({
                            content:'保养周期填写有误'
                        })
                        return;
                    }
                    if (type === '') {
                        // $.toast('请选择保养类型');
                        // vueThis.$message('请选择保养类型')
                         layer.open({
                            content:'请选择保养类型'
                        })
                        return;
                    }
                    if (lastTime === '') {
                        // $.toast('请选择上次保养时间');
                        // vueThis.$message('请选择上次保养时间')
                        layer.open({
                            content:'请选择上次保养时间'
                        })
                        return;
                    }
                    data.cycle = cycle * 24 * 60 * 60;
                    if ("内部保养" === type) {
                        data.type = 1;
                    } else if ('外包保养' === type) {
                        data.type = 2;
                    }
                    data.last_date = parseInt(new Date(lastTime).getTime() / 1000, 10);
                    //关闭popup
                    // $.closeModal($('.popup'));
                     $(".popup-about").css({'top':0})
                    //提交数据，绑定保养项
                    bindMaintenanceToMachine(data);
                })
            }
        }
    
    </script>
