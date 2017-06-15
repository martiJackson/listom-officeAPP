<style type="text/css">
    th {
        background-color: #ececec;
    }

    /*img {
    	width: 40px;
    	height: 60px;
    }*/

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

    .row-header {
        line-height: 50px;
        background-color: #ECECEC;
    }

    .row-header * {
        font-weight: bold;
    }

    .item-width {
        width: 14.285714%;
    }

    #data-div-work {
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
    .fontSize *{
        font-size: 1.1rem
    }
</style>
    <template>
        <div id="app" class="fontSize" style='margin-top:-60px;'>
             <div class="container-fluid" style="padding: 0; margin: 0;">
                <div class="row row-header">
                    <div class="col-md-1 item-width">车间名称</div>
                    <div class="col-md-1 item-width">机器编号</div>
                    <div class="col-md-1 item-width">当前任务名称</div>
                    <div class="col-md-1 item-width">加工工件名称</div>
                    <div class="col-md-1 item-width">持续时间</div>
                    <div class="col-md-1 item-width">操作人</div>
                    <div class="col-md-1 item-width">历史记录</div>
                </div>
                <div id="data-div-work">
                    <div id="inner-div-work">
                        <table id="table-content-work" class="table table-hover">
                        </table>
                        <div id="footer-div-work"></div>
                    </div>
                </div>
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
                    var vueThis=this;
                    // status.js
                    var workshopList; //车间列表
                    var runningTableDataArray = []; //状态表中的数据数组
                    var workingTableDataArray = []; //任务表中的数组数组
                    var loadedWorkshopSize; //已加载的车间个数
                    var loadedLightStatus; //是否加载了灯的状态

                    var isRunningStatus; //标记是否是获取当前机床的运行状态，true为运行状态，false为工作状态

                    var pageSize = 10;//分页显示，每页的条数
                    var currentPageIndex = 0;//分页显示，当前页面的索引
                    var pageCount; //页面数
                    var pageInterval = 10 * 1000; //两个页面间的切换间隔时间，10秒为默认时间，后面会根据页面数计算
                    var reloadInterval = 60 * 1000; //整个页面重新加载的间隔时间

                    var pageSwitcher = null;
                    var marqueeInterval = null;

                    //从APP中读取分页页面大小
                    if(window.js_interface != undefined) {
                        try {
                            var size = window.js_interface.getPageSize();
                            if(size != -1) {
                                pageSize = size;
                            }
                        }catch(e) {
                            console.error(e.toString());
                        }
                    }

                    //重新加载整个页面
                    function reloadWholePage() {
                        //不能用reload的方式刷新页面，否则断网情况下页面无法显示
                        // window.location.reload(true);
                    }

                    //获取所有的车间
                    function getWorkshops(b) {
                        console.log('正在获取车间信息。。。');
                        if(marqueeInterval != null) {
                            clearInterval(marqueeInterval);
                        }
                        console.log('isRunningStatus = ' + b);
                        isRunningStatus = b;
                        $('#refresh-hint').show();
                        loadedWorkshopSize = 0;
                        loadedLightStatus = false;
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/workshops',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                console.log('车间信息：\n' + formatJSON(JSON.stringify(response)));
                                if (response.status == 10001) {
                                    if (response.data.total > 0) {
                                        workshopList = response.data.list;
                                        runningTableDataArray = [];  //添加数据前先清空数组
                                        workingTableDataArray = [];
                                        for (var i = 0; i < workshopList.length; i++) {
                                            getMachinesByWorkshopId(workshopList[i].id, workshopList[i].name);
                                        }
                                    } else {
                                        console.log('没有车间信息');
                                    }
                                } else {
                                    console.log('获取车间信息失败' + response.status);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log('加载车间列表出错');
                                if(pageSwitcher != null) {
                                    clearTimeout(pageSwitcher);
                                }
                                if(jqXHR.status === 401) {
                                    //调用本地方法，重新认证
                                    try{
                                        console.log('通知app token过期...');
                                        if(window.js_interface != undefined) {
                                            window.js_interface.onTokenExpired();
                                        }
                                    }catch(e) {
                                    }
                                }
                            }
                        })
                    }

                    //根据车间id获取车间中的机床列表
                    function getMachinesByWorkshopId(workshopId, workshopName) {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                if (response.status == 10001) {
                                    if (response.data.total > 0) {
                                        // console.log(workshopName + '机器数据：\n' + formatJSON(JSON.stringify(response)));
                                        var machineList = response.data.list;
                                        for (var i = 0; i < machineList.length; i++) {
                                            var obj = machineList[i];
                                            var rowId = workshopId + '-' + obj.id;
                                            var machineName = obj.name;
                                            var index = workshopId * 1000 + obj.id;
                                            var row = {
                                                index: index,
                                                id: rowId,
                                                workshopId: workshopId,
                                                machineId: obj.id,
                                                workshopName: workshopName,
                                                machineName: machineName
                                            };
                                            runningTableDataArray.push(row);
                                            workingTableDataArray.push(row);
                                        }
                                    } else {
                                        console.log(workshopName + '没有机床信息');
                                    }
                                    loadedWorkshopSize++;

                                      // ********************************************************
                                     // 这里之后的内容出现问题
                                    // ********************************************************
                                    if(loadedWorkshopSize == workshopList.length) {//当所有车间的机床都获取完毕后，再显示数据
                                        if(isRunningStatus) {
                                            //是机床运行状态
                                            showRunningTableData();
                                        }else {
                                            //是机床工作状态
                                            showWorkingTableData();
                                        }
                                    }
                                } else {
                                    console.log('获取机床列表失败' + response.status);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log('加载机床列表出错' + textStatus);
                            }
                        })
                    }

                    //显示工作表中的数据
                    function showWorkingTableData() {
                        workingTableDataArray.sort(function(a, b) {
                            return a.index - b.index;
                        }); 

                        //加入分页tab
                        pageCount = Math.ceil(workingTableDataArray.length / pageSize);
                        pageInterval = parseInt(reloadInterval / pageCount, 10);
                        // console.error('page interval = ' + pageInterval);
                        var pagingHtml = '<div">';
                        for(var i = 0; i < pageCount; i++) {
                            pagingHtml += '<div class="paging-item paging-item-normal">' + (i + 1) + '</div>';
                        }
                        pagingHtml += '</div>';
                        $('#paging').html(pagingHtml);

                        showPageWorkingData();
                    }

                    //显示一页的工作数据
                    function showPageWorkingData() {
                        //根据当前页面索引，切换分页tab的背景色
                        var pagingItems = $('#paging').find('.paging-item');
                        if(pagingItems != null) {
                            pagingItems.each(function() {
                                var index = parseInt($(this).text(), 10);
                                if(index - 1 == currentPageIndex) {
                                    $(this).removeClass('paging-item-normal');
                                    $(this).addClass('paging-item-selected');
                                }else {
                                    $(this).removeClass('paging-item-selected');
                                    $(this).addClass('paging-item-normal');
                                }
                            });
                        }

                        var html = '';
                        var start = 0;
                        var end = workingTableDataArray.length;
                        for (var i = start; i < end; i++) {
                            var obj = workingTableDataArray[i];
                            html += '<tr class="data">';
                            html += '<td class="item-width">' + obj.workshopName + '</td>';
                            html += '<td class="item-width">' + obj.machineName + '</td>';
                            html += '<td class="item-width" id="task-name-' + obj.machineId + '">--</td>';
                            html += '<td class="item-width" id="piece-name-' + obj.machineId + '">--</td>';
                            html += '<td class="item-width" id="duration-' + obj.machineId + '">--</td>';
                            html += '<td class="item-width" id="operators-' + obj.machineId + '">--</td>';
                            html += '<td class="item-width history" id='+obj.machineId+'><a href="javascript:;">点击查看</a></td>';
                            // machine_working_history.html?id=' + obj.machineId + '
                            html += '</tr>';
                        }
                        $('#table-content-work').html(html);
                        $(".history").click(function(){
                            vueThis.$parent.ID=$(this).attr('id');
                            window.location='http://localhost:8080/#/machine_working_history';
                        })
                        $('#refresh-hint').hide();
                        refreshTableTitle();
                        //显示完表格数据后，再显示统计时间数据
                        for(var i = 0; i < workingTableDataArray.length; i++) {
                            getMachineWorkingData(workingTableDataArray[i].machineId);  
                        }
                       
                    }
                    //获取机床的工作数据
                    function getMachineWorkingData(machineId) {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/task/running/data',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: {
                                machine_id: machineId,
                                day: getTodayStartUnixTimestamp()
                            },
                            success: function(response) {
                                console.log('get machine working data: ' + formatJSON(JSON.stringify(response)));
                                if(response.status == 10001) {
                                    refreshWorkingTableRow(response.data, machineId);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                            }
                        })
                    }

                    //根据machineId刷新任务表中的一行
                    function refreshWorkingTableRow(data, machineId) {
                        //设置任务名称
                        var taskName = data.machining_task.name;
                        $('td#task-name-' + machineId).html(taskName); 

                        //设置工件名称
                        var pieceName = data.machining_task.workpiece_sm;
                        $('td#piece-name-' + machineId).html(pieceName); 

                        //计算持续时间
                        var timeArr = data.time_point;
                        var totalTime = 0;
                        if(timeArr != null && timeArr.length > 0) {
                            for(var i = 0; i < timeArr.length; i++) {
                                totalTime += (timeArr[i].end - timeArr[i].start);
                            }
                            $('td#duration-' + machineId).html(secondToFormattedTime(totalTime));
                        }

                        //显示操作人照片
                        var operatorsIds = data.machining_task.operator_ids;//id数组
                        if(operatorsIds.length > 0) {
                            showOperatorsPicture(operatorsIds, machineId);
                            // showOperatorsName(operatorsIds, machineId);
                        }
                        marqueeWorkingTable();
                    }

                    //滚动工作状态表
                    function marqueeWorkingTable() {
                        var dataDiv = document.getElementById("data-div-work");
                        var innerDiv = document.getElementById("inner-div-work");
                        var footerDiv = document.getElementById("footer-div-work");
                        var visibleHeight = $(window).height();
                        if(marqueeInterval != null) {
                            clearInterval(marqueeInterval);
                        }
                        marqueeInterval = setInterval(function() {
                            if (footerDiv.offsetTop - dataDiv.scrollTop - visibleHeight <= 0) {
                                dataDiv.scrollTop -= innerDiv.offsetHeight;
                            } else {
                                dataDiv.scrollTop += 1;
                            }
                        }, 60);
                    }

                    //显示操作人姓名
                    function showOperatorsName(operatorIds, machineId) {
                        var dom = $('td#operators-' + machineId);
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'companies/users/names',
                            data: {
                                user_ids: JSON.stringify(operatorIds)
                            },
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                if (response.status == 10001) {
                                    var nameArr = response.data.names;
                                    var names = '';
                                    if (nameArr.length > 0) {
                                        for (var i = 0; i < nameArr.length; i++) {
                                            names += nameArr[i] + ', ';
                                        }
                                        dom.html(names.substring(0, names.length - 2));
                                    }
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                            }
                        })
                    }

                    //显示操作人照片
                    function showOperatorsPicture(operatorIds, machineId) {
                        var html = '';
                        var operatorId;
                        var dom = $('td#operators-' + machineId);
                        dom.html('');
                        for(var i = 0; i < operatorIds.length; i++) {
                            operatorId = operatorIds[i];
                            $.ajax({
                                type: 'GET',
                                url: requestBaseUrl + 'companies/users/face_samples',
                                headers: { 
                                    'Authorization': 'Bearer ' + getToken()
                                },
                                data: {
                                    user_id: operatorId
                                },
                                success: function(response) {
                                   
                                    if(response.status == 10001) {
                                        var samples = response.data.face_samples;
                                        if(samples.length > 0) {
                                            var sampleUrl = 'https://sample.listome.com' + samples[0];
                                            html = '<img src="' + sampleUrl + '">';
                                            dom.append(html);
                                        }
                                    }
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.log(errorThrown);
                                }
                            })
                        }
                    }

                    //显示运行状态表格中的数据
                    function showRunningTableData() {
                        runningTableDataArray.sort(function(a, b) {
                            return a.index - b.index;
                        });

                        //加入分页tab
                        pageCount = Math.ceil(runningTableDataArray.length / pageSize);
                        pageInterval = parseInt(reloadInterval / pageCount, 10);
                        console.error('page interval = ' + pageInterval);
                        var pagingHtml = '<div">';
                        for(var i = 0; i < pageCount; i++) {
                            pagingHtml += '<div class="paging-item paging-item-normal">' + (i + 1) + '</div>';
                        }
                        pagingHtml += '</div>';
                        $('#paging').html(pagingHtml);
                        showPageRunningData();
                    }

                    //显示一页的机床运行数据
                    function showPageRunningData() {
                        //根据当前页面索引，切换分页tab的背景色
                        var pagingItems = $('#paging').find('.paging-item');
                        if(pagingItems != null) {
                            pagingItems.each(function() {
                                var index = parseInt($(this).text(), 10);
                                if(index - 1 == currentPageIndex) {
                                    $(this).removeClass('paging-item-normal');
                                    $(this).addClass('paging-item-selected');
                                }else {
                                    $(this).removeClass('paging-item-selected');
                                    $(this).addClass('paging-item-normal');
                                }
                            });
                        }

                        var html = '';
                        var start = 0;
                        var end = runningTableDataArray.length;
                        for (var i = start; i < end; i++) {
                            var obj = runningTableDataArray[i];
                            html += '<tr class="data">';
                            html += '<td class="width1">' + obj.workshopName + '</td>';
                            html += '<td class="width1">' + obj.machineName + '</td>';
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
                        $('tr.data').remove();
                        $('#table-content').append(html);
                        $('td').css('text-align', 'center');
                        $('#refresh-hint').hide();
                        refreshTableTitle();
                        //显示完表格数据后，再显示统计时间数据
                        for(var i = 0; i < runningTableDataArray.length; i++) {
                            getMachineRunningData(runningTableDataArray[i].machineId);  
                        }
                    }

                    //滚动运行状态表
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
                                dataDiv.scrollTop -= innerDiv.offsetHeight;
                            } else {
                                dataDiv.scrollTop += 1;
                            }
                        }, 60);
                    }

                    //获取机器某一天的运行状态数据
                    function getMachineRunningData(machineId) {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/datas',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: {
                                day: getTodayStartUnixTimestamp(),
                                is_today: 1
                            },
                            success: function(response) {
                                // console.info("获取机器运行状态数据：" + JSON.stringify(response));
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
                                    var otherTime = parseInt(new Date().getTime() / 1000, 10) - greenTime - yellowTime - redTime - getTodayStartUnixTimestamp();
                                    $('td#purple-' + machineId).text(secondToFormattedTime(otherTime));
                                }
                                getLightStatus();
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.error('get machine running data error! ' + textStatus);
                            }
                        })
                    }

                    //刷新灯的时间
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
                            // if(totalTime < 60) {
                            //  label.text(totalTime + "秒");
                            // }else if(totalTime / 60 < 60) {
                            //  label.text((totalTime / 60).toFixed(2) + "分钟");
                            // }else{
                            //  label.text((totalTime / 3600).toFixed(2) + "小时");
                            // }
                        }
                        return totalTime;
                    }

                    //获取机器灯的状态信息
                    function getLightStatus() {
                        if(loadedLightStatus) {
                            return ;
                        }
                        loadedLightStatus = true;
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
                                // console.log('light status: ' + formatJSON(JSON.stringify(response)));
                                if(response.status == 10001) {
                                    var statusData = response.data;
                                    if(workshopList.length > 0) {
                                        //显示机器状态灯
                                        for(var i = 0; i < workshopList.length; i++) {
                                            var workshopId = workshopList[i].id;
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
                                console.log('获取机器状态信息出错' + textStatus);
                            }
                        })
                    }

                    //刷新状态信息
                    function refreshLightStatus(statusObj) {
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
                            // console.log(id + "---->红灯");
                            $('img#status-red-' + id).attr('src', 'static/images/ic_light_red.png');
                        }else {
                            $('img#status-red-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        if(statusObj.yellow == 2) {
                            // console.log(id + "---->黄灯");
                            $('img#status-yellow-' + id).attr('src', 'static/images/ic_light_yellow.png');
                        }else {
                            $('img#status-yellow-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        if(statusObj.green == 2) {
                            // console.log(id + "---->绿灯");
                            $('img#status-green-' + id).attr('src', 'static/images/ic_light_green.png');
                        }else {
                            $('img#status-green-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        if(statusObj.purple == 2) {
                            // console.log(id + "---->紫灯");
                            $('img#status-purple-' + id).attr('src', 'static/images/ic_light_purple.png');
                        }else {
                            $('img#status-purple-' + id).attr('src', 'static/images/ic_light_gray.png');
                        }
                        marqueeRunningTable();
                    }

                    //根据机器id获取该机器的历史任务记录
                    function getWorkHistory(machineId) {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/task/history',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: {
                                machine_id: machineId,
                                offset: 0,
                                skip: 9
                            },
                            success: function(response) {
                                console.log('get work history: \n' + formatJSON(JSON.stringify(response)));
                                if(response.status == 10001) {
                                    showWorkHistory(response.data.list, machineId);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                            }
                        })
                    }

                    //显示任务历史记录
                    function showWorkHistory(list, machineId) {
                        if(list.length > 0) {
                            var html = '';
                            for(var i = 0; i < list.length; i++) {
                                var obj = list[i];
                                html += '<tr class="data">';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + obj.name + '</td>';
                                html += '<td>' + obj.workpiece_sm + '</td>';
                                html += '<td>' + obj.workpiece_name + '</td>';
                                html += '<td id="operators-' + machineId + '-' + i + '"></td>';
                                html += '<td class="remark-label">' + obj.remark + '</td>';
                                html += '</tr>';
                            }
                            $('tr.data').remove();
                            $('table.table').append(html);
                            for(var i = 0; i < list.length; i++) {
                                getNamesByIds(list[i].operator_ids, machineId, i);
                            }
                        }
                    } 

                    //根据操作人的id数组获取对应的姓名数组
                    function getNamesByIds(ids, machineId, index) {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'companies/users/names',
                            data: {
                                user_ids: JSON.stringify(ids)
                            },
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                if(response.status == 10001) {
                                    var nameArr = response.data.names;
                                    var names = '';
                                    if(nameArr.length > 0) {
                                        for(var i = 0; i < nameArr.length; i++) {
                                            names += nameArr[i] + ', ';
                                        }
                                        $('td#operators-' + machineId + '-' + index).html(names.substring(0, names.length - 2));
                                    }
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                            }
                        })
                    }

                    var companyAlias = '';

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
                                    companyAlias = response.data.alias;
                                    var dateNow = getTimeNow();
                                    var dateStr = '（' + dateNow.yearStr + '年' + dateNow.monthStr + '月' + dateNow.dayStr + '日）';
                                    document.title = (companyAlias + '-机床运行状态监控表' + dateStr);
                                }
                            },
                            error: function(xhr) {
                                console.log('get company alias error: ' + xhr.status);
                            }
                        })
                    }

                    //刷新表格的标题
                    function refreshTableTitle() {
                        var date = new Date();
                        var dateStr = '（' + date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日）';
                        if(isRunningStatus) {
                            //机床运行状态监控表
                            $('title').text(companyAlias + '-机床运行状态监控表' + dateStr);
                        }else {
                            //机床工作状态监控表
                            $('title').text(companyAlias + '-机床工作状态监控表' + dateStr);
                        }
                    }



                     try {
                        var visibleHeight = $(window).height();
                        $('#data-div-work').height(visibleHeight - 50);
                        getCompanyAlias();
                        getWorkshops(false);
                        setInterval("getWorkshops(false)", reloadInterval);
                    } catch (e) {
                        console.log(e.toString());
                    }
                }
            }
   
    </script>

