<style type="text/css">
    /** {
        font-size: 2rem;
    }*/
    
    th {
        background-color: #ececec;
    }
    
    img.light {
        width: 1.15em;
        height: 1.15em;
        line-height: 1.15em;
        margin-bottom: 5px;
    }
    
    .red {
        color: red;
    }
    
    .green {
        color: green;
    }
    
    .yellow {
        color: #999900;
    }

    #paging {
        height: 60px;
        text-align: center;
    }

    .paging-item-normal {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background-color: #666666;
        color: white;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 17px;
        line-height: 50px;
        display: inline-block;
    }

    .paging-item-selected {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        background-color: #0099FF;
        color: white;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 25px;
        font-weight: bold;
        line-height: 60px;
        display: inline-block;
    }

    .table {
        margin-bottom: 0;
    }

    #data-div {
        overflow: hidden;
        margin: 0;
        padding: 0;
    }

    .row-header {
        line-height: 50px;
        background-color: #ECECEC;
    }

    .row-header * {
        font-weight: bold;
    }

    .width16 {
        width: 13.333333%;
    }

    .width15 {
        width: 12.5%;
    }

    .width1 {
        width: 9.375%;
    }

    .col-md-1 {
        text-align: center;
    }

    #footer-bar {
        height: 50px;
        background-color: #ECECEC;
    }
    #data-div{
        height:30rem!important;
    }
    #myModal2{
        width:100%;
        height:100%;
        opacity:0;
        background:rgba(0,0,0,.6);
        position:fixed;
        top:100%;
        left:0;
        transition:all linear .5s;
    }
    #myModal2.slider{
        opacity:1;
        top:0;
        
    }
    #modal-body2{
        background:#fff;
        width:80%;
        margin-left:10%;
    }
    .modal-header2{
        background:#fff;
         width:80%;
        margin:20% 0 0 10%;
    }
    h4{
        margin:0;
        padding:10px 0;
    }
</style>
<template>
        <div id="app" style='margin-top:-60px;'>
             <div class="container-fluid" style="padding: 0; margin:0;">
                    <div class="row row-header" style="margin-left: 0; margin-right: 0;">
                         <div class="col-md-1 width1">车间名称</div>
                            <div class="col-md-1 width1">机器编号</div>
                            <div class="col-md-1 width15">当前运行状态</div>
                            <div class="col-md-1 width15 red">机器故障时间</div>
                            <div class="col-md-1 width15 yellow">机器待机时间</div>
                            <div class="col-md-1 width15 green">正常工作时间</div>
                            <div class="col-md-1 width15">其他时间</div>
                            <div class="col-md-1 width1">加工个数</div>
                            <div class="col-md-1 width1 module-status">模块状态</div>
                    </div>
                    <div id="data-div">
                        <div id="inner-div">
                            <table id="table-content" class="table table-hover">
                            </table>
                            <div id="footer-div"></div>
                        </div>
                    </div>
                    <div id="footer-bar">
                        <label style="line-height: 50px; margin-left: 50px; float: left;">设置统计起始时间：</label>
                        <div class="dropdown" style="float: left; line-height: 50px;">
                        <button class="btn btn-default dropdown-toggle" type="button" id="select-start-time-btn" data-toggle="modal" data-target="#myModal">
                            00:00
                            <span class="caret"></span>
                         </button>
                        </div>
                    </div>
                </div>
                <div id="myModal2" >
                    <div class="modal-header2">
                        <button type="button" class="close" ><span id='closeTime'>&times;</span><span class="sr-only">Close</span></button>
                        <h4 >设置统计起始时间</h4>
                    </div>
                    <div class="modal-body2" id="modal-body2"></div>
                </div>
            </div>
</template>
   
    <script type="text/javascript">
        export default {
                  data(){
                    return {
                    }
                },
                mounted:function(){
                    function refresh(){
                        location.reload();
                    }
                    setInterval(refresh,60000);

                    // running-status.js

                    var workshopListObj;
                    var localStorageUtil = new LocalStorageUtils();
                    var workshopQueue = new Queue();

                    //每次取pageSize条机器数据
                    var pageSize = 15;
                    var offset = 0;
                    var skip = pageSize;
                    var currentWorkshop;
                    var pageData;
                    var allMachinesLoaded = false;
                    var slider=false;

                    //从APP中读取分页页面大小
                    if(window.js_interface != undefined) {
                        try {
                            var size = window.js_interface.getPageSize();
                            if(size != -1) {
                                pageSize = size;
                            }
                        }catch(e) {
                            Log.e(e.toString());
                        }
                    }

                    var height = $(window).height();
                    $('#data-div').height(height - 50 - 50);
                    if(window.localStorage) {
                        var startTime = window.localStorage.getItem('startTime');
                        if(startTime != null) {
                            $('#select-start-time-btn').html(startTime + '<span class="caret"></span>');
                        } else {
                            $('#select-start-time-btn').html('00:00<span class="caret"></span>');
                        }
                    }

                    var modalBodyHtml = '';
                    var hourNow = new Date().getHours();
                    for(var i = 0; i < 4; i++) {
                        if(i > 0) {
                            modalBodyHtml += '<div class="row" style="margin-top: 10px;">';
                        } else {
                            modalBodyHtml += '<div class="row">';   
                        }
                        for(var j = 0; j < 6; j++) {
                            var time = i * 6 + j;
                            var disable = false;
                            if(time > hourNow) {
                                disable = true;
                            }
                            if(time < 10) {
                                time = '0' + time + ':00';
                            } else {
                                time = time + ':00';
                            }
                            if(disable) {
                                modalBodyHtml += '<div class="col-md-2"><button type="button" class="btn btn-default btn-start-time" disabled="disabled">' + time + '</button></div>';  
                            } else {
                                modalBodyHtml += '<div class="col-md-2"><button type="button" class="btn btn-default btn-start-time">' + time + '</button></div>';
                            }
                        }
                        modalBodyHtml += '</div>'
                    }
                    $('#modal-body2').html(modalBodyHtml);

                     $('#select-start-time-btn').click(function(){
                         $('#myModal2').toggleClass('slider')                       
                     });
                    $("#closeTime").click(function(){
                         $('#myModal2').removeClass('slider')
                    }); 

                      $('#myModal2').click(function(){
                        $('#myModal2').removeClass('slider')
                      });

                    $('.btn-start-time').click(function() {
                        var time = $(this).text();
                        $('#myModal2').removeClass('slider')
                        if(time != null) {
                            $('#select-start-time-btn').html(time + '<span class="caret"></span>');
                            if(window.localStorage) {
                                window.localStorage.setItem('startTime', time);
                            }
                            getWorkshops();
                        }
                    });

                    getWorkshops();
                    //获取车间
                    function getWorkshops() {
                        offset = 0;
                        skip = pageSize;
                        $('#table-content').text('');
                        getCompanyAlias();
                        workshopListObj = localStorageUtil.get('workshops');
                        if(workshopListObj != null) {
                            loadMachines(workshopListObj);
                            return ;
                        }
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/workshops',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                // Log.d('车间信息：\n' + formatJSON(JSON.stringify(response)));
                                if(response != null && response.status == 10001) {
                                    if(response.data.total > 0) {
                                        workshopListObj = response.data.list;
                                        //保存车间数据，有效期5分钟
                                        localStorageUtil.set('workshops', workshopListObj, 5 * 60 * 60);
                                        loadMachines(workshopListObj);  
                                    }
                                } 
                            },
                            error: function(xhr) {
                                Log.d('获取车间出错：' + xhr.status);
                                //5秒后重试获取车间
                                setTimeout(function() {
                                    getWorkshops();
                                }, 5000);
                            }
                        })
                    }

                    //加载机器数据
                    function loadMachines(workshopList) {
                        workshopQueue.clear();
                        for(var i = 0; i < workshopList.length; i++) {
                            workshopQueue.enQueue(workshopList[i]);
                        }
                        currentWorkshop = workshopQueue.deQueue();
                        loadPageData(true);
                    }

                    //加载一页数据
                    function loadPageData(isNewPage) {
                        if(isNewPage) {
                            pageData = [];  
                        }
                        if(currentWorkshop != null) {
                            loadMachinesByWorkshop(currentWorkshop, offset, skip, loadMachineSucCallback, loadMachineErrCallback);  
                        }
                    }

                    //分页加载车间中的机器
                    function loadMachinesByWorkshop(workshopObj, offset, skip, sucCallback, errCallback) {
                        $.ajax({
                            type: 'GET',
                            async: false,
                            url: requestBaseUrl + 'iot/companies/workshops/' + workshopObj.id + '/machines',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: {
                                offset: offset,
                                skip: skip
                            },
                            success: function(response) {
                                if(response != null && response.status == 10001) {
                                    var list = response.data.list;
                                    var total = response.data.total;
                                    var workshopLoadComplete = false;
                                    if(total <= 0) {
                                        workshopLoadComplete = true;
                                    } else if(list != null && offset + list.length >= total) {
                                        workshopLoadComplete = true;
                                    }
                                    if(sucCallback != null && typeof sucCallback == 'function') {
                                        sucCallback(list, workshopLoadComplete);
                                    }
                                } else {
                                    if(errCallback != null && typeof errCallback == 'function') {
                                        errCallback();
                                    }
                                }
                            },
                            error: function(xhr) {
                                Log.d('加载机器出错：' + xhr.status);
                                if(errCallback != null && typeof errCallback == 'function') {
                                    errCallback();
                                }
                            }
                        });
                    }

                    //加载机器成功的回调
                    function loadMachineSucCallback(list, workshopLoadComplete) {
                        var str = '';
                        if(workshopLoadComplete) {
                            str = '当前车间机器已全部加载完';
                        } else {
                            str = '当前车间机器未全部加载完';
                        }
                        var len = list == null ? 0 : list.length;
                        Log.d('加载' + currentWorkshop.name + '的' + len + '条机器数据，' + str);

                        if(list != null) {
                            for(var i = 0; i < list.length; i++) {
                                var item = list[i];
                                var row = {
                                    index: currentWorkshop.id * 1000 + item.id,
                                    id: currentWorkshop.id + '-' + item.id,
                                    workshopId: currentWorkshop.id,
                                    machineId: item.id,
                                    workshopName: currentWorkshop.name,
                                    machineName: item.name,
                                    machineType:item.type
                                };
                                pageData.push(row);
                            }
                        }
                        var pageLoadComplete = false;
                        if(pageData.length >= pageSize) {
                            pageLoadComplete = true;
                        }

                        if(workshopLoadComplete) {
                            currentWorkshop = workshopQueue.deQueue();
                            if(currentWorkshop == null) {
                                allMachinesLoaded = true;
                                showPageDataTable();
                                Log.e('所有车间中的机器全部加载完毕，最后一页加载了' + pageData.length + '条数据');
                                return ;
                            }
                            //车间加载完
                            if(pageLoadComplete) {
                                offset = 0;
                                skip = pageSize;
                                Log.d('一页数据加载完毕，准备加载下一页。。。');
                                showPageDataTable();
                                // setTimeout(function() {
                                //  loadPageData(true);
                                // }, 3000);
                            } else {
                                offset = 0;
                                skip = pageSize - pageData.length;
                                loadPageData(false);
                            }
                        } else {
                            //车间还没加载完
                            if(pageLoadComplete) {
                                offset += len;
                                skip = 20;
                                Log.d('一页数据加载完毕，准备加载下一页。。。');
                                showPageDataTable();
                                // setTimeout(function() {
                                //  loadPageData(true);
                                // }, 3000);
                            } else {
                                offset += len;
                                skip = pageSize - pageData.length;
                                loadPageData(false);
                            }
                        }
                    }

                    //加载机器失败的回调
                    function loadMachineErrCallback() {
                        Log.e('load machine error.');
                        //加载车间中的机器失败，10秒后重试
                        setTimeout(function() {
                            loadPageData(false);
                        }, 10 * 1000);
                    }

                    //显示一页数据到table中
                    function showPageDataTable() {
                        var html = '';
                        for(var i = 0; i < pageData.length; i++) {
                            var obj = pageData[i];
                            html += '<tr class="data">';
                            html += '<td class="width1">' + obj.workshopName + '</td>';
                            html += '<td class="width1">'+obj.machineType + '-' + obj.machineName + '</td>';
                            html += '<td class="width15" id="status-' + obj.id + '">\
                                <img id="status-red-' + obj.id + '" src="static/images/ic_light_gray.png" class="light"/>\
                                <img id="status-yellow-' + obj.id + '" src="static/images/ic_light_gray.png" class="light"/>\
                                <img id="status-green-' + obj.id + '" src="static/images/ic_light_gray.png" class="light"/>\
                                <img id="status-purple-' + obj.id + '" src="static/images/ic_light_gray.png" class="light"/>\
                            </td>';
                            html += '<td class="red width15" id="red-' + obj.machineId + '">--</td>';   //red
                            html += '<td class="yellow width15" id="yellow-' + obj.machineId + '">--</td>';  //yellow
                            html += '<td class="green width15" id="green-' + obj.machineId + '">--</td>';  //green
                            html += '<td class="width15" id="purple-' + obj.machineId + '">--</td>';  //purple
                            html += '<td class="width1" id="count-' + obj.machineId + '">--</td>';
                            html += '<td class="width1" id="module-status-' + obj.id + '">--</td>';
                            html += '</tr>';
                        }
                        // $('tr.data').remove();
                        $('#table-content').append(html);
                        $('td').css('text-align', 'center');
                        $('#refresh-hint').hide();

                        for(var i = 0; i < pageData.length; i++) {
                            getMachineRunningData(pageData[i].machineId);
                        }
                    }

                    //获取机器某一天的运行状态数据
                    function getMachineRunningData(machineId) {
                        var time = getTodayStartUnixTimestamp();
                        if(window.localStorage) {
                            var startTime = window.localStorage.getItem('startTime');
                            if(startTime != null) {
                                var arr = startTime.split(':');
                                if(arr != null && arr.length > 0) {
                                    var hour = arr[0];
                                    time += parseInt(hour, 10) * 60 * 60;
                                }
                            }
                        }
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/datas',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: {
                                day: time,
                                is_today: 1
                            },
                            success: function(response) {
                                // Log.d("获取机器运行状态数据：" + JSON.stringify(response));
                                if(response.status == 10001) {
                                    var data = response.data;
                                    var greenTime = refreshTime(data.green, machineId, "green");
                                    try {
                                        $('#count-' + machineId).html(data.green.length);
                                    }catch(e) {}
                                    var yellowTime = refreshTime(data.yellow, machineId, "yellow");
                                    var redTime = refreshTime(data.red, machineId, "red");
                                    // refreshTime(data.purple, machineId, "purple");
                                    //设置其他时间，其他时间 = 当前时间 - 当天起始时间 - 三种灯总共时间
                                    var otherTime = parseInt(new Date().getTime() / 1000, 10) - greenTime - yellowTime - redTime - time;
                                    $('td#purple-' + machineId).text(secondToFormattedTime(otherTime));
                                }
                                getLightStatus();
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                marqueeRunningTable();
                            }
                        })
                    }

                    //刷新时间数据
                    function refreshTime(data, machineId, color) {
                        var totalTime = 0;
                        var label = $('td#' + color + '-' + machineId);
                        if(data == null || data.length == 0) {
                            label.text("--");
                        }else{
                            for(var i = 0; i < data.length; i++) {
                                var obj = data[i];
                                totalTime += (obj.end - obj.start);
                            }
                            if(totalTime > 0) {
                                label.text(secondToFormattedTime(totalTime));   
                            } else {
                                label.text("--");   
                            }
                        }
                        return totalTime;
                    }

                    var isGettingLightStatus = false;

                    //获取机器灯的状态信息
                    function getLightStatus() {
                        if(isGettingLightStatus) {
                            return ;
                        }
                        isGettingLightStatus = true;
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/machines/status',
                            data: {
                                'workshop_id': 0
                            },
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                isGettingLightStatus = false;
                                // Log.d('light status: ' + formatJSON(JSON.stringify(response)));
                                if(response.status == 10001) {
                                    var statusData = response.data;
                                    if(workshopListObj != null && workshopListObj.length > 0) {
                                        //显示机器状态灯
                                        for(var i = 0; i < workshopListObj.length; i++) {
                                            var workshopId = workshopListObj[i].id;
                                            var machinesObj = statusData['' + workshopId];
                                            if(typeof(machinesObj) != 'undefined') {
                                                var machines = machinesObj.machine;
                                                if(machines.length > 0) {
                                                    for(var j = 0; j < machines.length; j++) {
                                                        var statusObj = machines[j];
                                                        refreshLightStatus(statusObj);  
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                isGettingLightStatus = false;
                                refreshLightStatus(null);
                                Log.d('获取机器状态信息出错' + textStatus);
                            }
                        })
                    }

                    //刷新状态信息
                    function refreshLightStatus(statusObj) {
                        if(statusObj == null) {
                            marqueeRunningTable();
                            return ;
                        }
                        var id = statusObj.workshop_id + '-' + statusObj.machine_id;
                        var moduleDom = $('#module-status-' + id);
                        if(statusObj.power == -1) {
                            moduleDom.text('断电');   
                            moduleDom.css('color', 'red');
                        }else {
                            moduleDom.text('通电');   
                            moduleDom.css('color', 'green');
                        }
                        if(statusObj.red == 2) {
                            // Log.d(id + "---->红灯");
                            $('img#status-red-' + id).attr('src', 'static/images/ic_light_red.png');
                        }else {
                            $('img#status-red-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        if(statusObj.yellow == 2) {
                            // Log.d(id + "---->黄灯");
                            $('img#status-yellow-' + id).attr('src', 'static/images/ic_light_yellow.png');
                        }else {
                            $('img#status-yellow-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        if(statusObj.green == 2) {
                            // Log.d(id + "---->绿灯");
                            $('img#status-green-' + id).attr('src', 'static/images/ic_light_green.png');
                        }else {
                            $('img#status-green-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        if(statusObj.purple == 2) {
                            // Log.d(id + "---->紫灯");
                            $('img#status-purple-' + id).attr('src', 'static/images/ic_light_purple.png');
                        }else {
                            $('img#status-purple-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        marqueeRunningTable();
                    }

                    var marqueeInterval = null;

                    //滚动运行状态表
                    var oldScroll=document.getElementById("data-div").scrollTop
                    function marqueeRunningTable() {
                        var dataDiv = document.getElementById("data-div");
                        var innerDiv = document.getElementById("inner-div");
                        var footerDiv = document.getElementById("footer-div");
                        var visibleHeight = $(window).height();
                        if(marqueeInterval != null) {
                            clearInterval(marqueeInterval);
                        }
                        marqueeInterval = setInterval(function() {
                            if (footerDiv.offsetTop - dataDiv.scrollTop - visibleHeight <= 0) {
                                // dataDiv.scrollTop -= innerDiv.offsetHeight;
                                // Log.d('滚动到底了');
                                //滚动到底，加载下一页数据 
                                clearInterval(marqueeInterval);
                                if(allMachinesLoaded) {
                                    dataDiv.scrollTop = innerDiv.offsetHeight;
                                    Log.d('滚动到底，所有数据加载完毕');
                                    //所有车间中的机器都加载完了
                                    getWorkshops();
                                    allMachinesLoaded = false;
                                } else {
                                    Log.d('滚动到底，加载下一页数据');
                                    loadPageData(true);
                                }
                            }else {
                                dataDiv.scrollTop += 1;

                            }
                        }, 60);
                    }

                    //获取公司别名
                    function getCompanyAlias() {
                        $.ajax({
                            type: 'GET',
                            async: false,
                            url: requestBaseUrl + 'companies/profile',
                            headers: {
                                'Authorization': 'Bearer ' + getToken() 
                            },
                            success: function(response) {
                                if(response != null && response.status === 10001) {
                                    var  companyAlias = response.data.alias;
                                    var date = new Date();
                                    var dateStr = '（' + date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日）';
                                    document.title = (companyAlias + '-机床运行状态监控表' + dateStr);
                                }
                            },
                            error: function(xhr) {
                                Log.d('get company alias error: ' + xhr.status);
                            }
                        })
                    }

                }
            }       
    </script>