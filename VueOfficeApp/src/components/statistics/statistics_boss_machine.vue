<style type="text/css">
    .chart-content {
        width: 100%;
        height: 500px;
    }
    
    p#summary {
        font-size: 15px;
        width: 100%;
        text-align: center;
    }
</style>
<template>
    <div id="app">
        <div class="content">
        <div class="content-block">
            <div class="buttons-row">
                <a href="#tab1" class="tab-link active button" id="tab-menu1">折线图</a>
                <a href="#tab2" class="tab-link button" id="tab-menu2">饼状图</a>
            </div>
        </div>
        <div id="main" class="chart-content"></div>
        <div class="content-block">
            <div class="row">
                <div class="col-50"><a id="btn-pre-month" class="button button-big button-fill button-danger">上个月</a></div>
                <div class="col-50"><a id="btn-next-month" class="button button-big button-fill button-success">下个月</a></div>
            </div>
        </div>
    </div>
    </div>
</template>

    <script type="text/javascript">
        var echarts = require('echarts');
         export default {
                  data(){
                    return {
                    }
                },
                mounted:function(){
                    var vueThis=this;
                    var machineCount = 0;
                    getMachineCount();
                    
                    var isShowLineCharts = true;
                    $('#tab-menu1').click(function() {
                        $(this).addClass('active');
                        $('#tab-menu2').removeClass('active');
                        isShowLineCharts = true;
                        showLineCharts(currentData);
                    });

                    $('#tab-menu2').click(function() {
                        $(this).addClass('active');
                        $('#tab-menu1').removeClass('active');
                        isShowLineCharts = false;
                        showPieCharts(currentData);
                    });

                    var currentData;
                    var currentMonth = monthNow;
                    var currentYear = yearNow;
                    var startTime = getStartEndTime(yearNow, monthNow).start_time; //本月的开始时间
                    var endTime = parseInt(new Date().getTime() / 1000, 10); //当前的时间

                    getMachineStatisticsData(startTime, endTime);

                    //显示上个月
                    $('a#btn-pre-month').click(function() {
                        if (currentMonth == 1) {
                            currentMonth = 12;
                            currentYear--;
                        } else {
                            currentMonth--;
                        }
                        startTime = getStartEndTime(currentYear, currentMonth).start_time;
                        endTime = getStartEndTime(currentYear, currentMonth).end_time;
                        getMachineStatisticsData(startTime, endTime);
                    });

                    //显示下个月
                    $('a#btn-next-month').click(function() {
                        if (currentMonth >= monthNow && currentYear >= yearNow) {
                            // $.alert('还没到下个月', '提示');
                            vueThis.$message('还没到下个月')
                            return;
                        }
                        if (currentMonth == 12) {
                            currentMonth = 1;
                            currentYear++;
                        } else {
                            currentMonth++;
                        }
                        startTime = getStartEndTime(currentYear, currentMonth).start_time;
                        endTime = getStartEndTime(currentYear, currentMonth).end_time;
                        getMachineStatisticsData(startTime, endTime);
                    });

                    //获取机器的统计数据
                    function getMachineStatisticsData(startTime, endTime) {
                        // $.showPreloader();
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/machines/datas',
                            data: {
                                workshop_id: 0,
                                start_time: startTime,
                                end_time: endTime
                            },
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                // $.hidePreloader();
                                console.log('获取到机器统计数据：' + formatJSON(JSON.stringify(response)));
                                if (response.status == 10001) {
                                    currentData = response.data;
                                    if (isShowLineCharts) {
                                        showLineCharts(response.data);
                                    } else {
                                        showPieCharts(response.data);
                                    }
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log('获取机器统计数据失败：');
                            }
                        })
                    }

                    //显示折线图
                    function showLineCharts(obj) {
                        if (endTime - startTime <= 60 * 60 * 24) {
                            //当月第一天，返回的数据不是按月统计的
                            showMonthFirstDayLineCharts(obj);
                            return;
                        }

                        // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(document.getElementById('main'));
                        var timeArr = obj.keys;
                        var xTimeArr = [];
                        var redData = [];
                        var greenData = [];
                        var yellowData = [];
                        var purpleData = [];
                        var xData = [];
                        var redTime, greenTime, yellowTime, purpleTime;
                        var dateNow = getTimeNow();
                        var dayCount = (dateNow.month == currentMonth && dateNow.year == currentYear) ? dayNow : getDaysOfMonth(currentYear, currentMonth);
                        var todayDate = yearNow + '-' + numberProcess(monthNow) + '-' + numberProcess(dayNow);

                        for (var i = 1; i <= dayCount; i++) {
                            var date = currentYear + '-' + numberProcess(currentMonth) + "-" + numberProcess(i);
                            if (date == todayDate) {
                                continue;
                            }
                            xTimeArr.push(date);
                            if (timeArr == null || timeArr.indexOf(date) == -1) {
                                redData.push(0);
                                greenData.push(0);
                                yellowData.push(0);
                                purpleData.push(0);
                            } else {
                                redTime = parseInt(obj.datas[date].red / 60);
                                redData.push(redTime);
                                greenTime = parseInt(obj.datas[date].green / 60);
                                greenData.push(greenTime);
                                yellowTime = parseInt(obj.datas[date].yellow / 60);
                                yellowData.push(yellowTime);
                                purpleTime = parseInt(obj.datas[date].purple / 60);
                                purpleData.push(purpleTime);
                            }
                        }

                        var dataZoom = null;
                        if (xTimeArr.length > 4) {
                            //如果月份个数大于4，则使用dataZoom控件
                            dataZoom = [{
                                type: 'slider',
                                end: 100,
                                start: 60,
                                zoomLock: false,
                                handleSize: 25
                            },
                            {
                                start: 0,
                                end: 10,
                                handleIcon: 'M0,0 v12h8v-12h0 Z',
                                handleSize: '80%',
                                handleStyle: {
                                    color: 'rgba(185,185,185,.8)',
                                    shadowBlur: 3,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                                    shadowOffsetX: 2,
                                    shadowOffsetY: 2
                                }
                            }];
                        }

                        var dateNow = getTimeNow();
                        var dateStr = '（' + currentYear + '年' + currentMonth + '月）';
                        var chartTitle = '机床整体数据统计图' + dateStr;

                        // 指定图表的配置项和数据
                        var option = {
                            title: {
                                text: chartTitle,
                                subtext: '单位：分钟',
                                x: 'center'
                            },
                            grid: {
                                top: '20%'
                            },
                            dataZoom: dataZoom,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            color: ['#CC0033', '#CCCC33', '#66CC99'],
                            legend: {
                                data: ['故障时间', '待机时间', '工作时间'],
                                top: 60
                            },
                            xAxis: [{
                                data: xTimeArr,
                                type: 'category'
                            }],
                            yAxis: [{
                                type: 'value'
                            }],
                            series: [{
                                name: '故障时间',
                                type: 'line',
                                data: redData,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                            }, {
                                name: '待机时间',
                                type: 'line',
                                data: yellowData,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            }, {
                                name: '工作时间',
                                type: 'line',
                                data: greenData,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                markLine: {
                                    data: [{
                                        type: 'average',
                                        name: '平均值'
                                    }]
                                }
                            }]
                        };

                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                    }

                    //显示某月第一天的统计折线图
                    function showMonthFirstDayLineCharts(obj) {
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(document.getElementById('main'));

                        var dateNow = getTimeNow();
                        var dateStr = '（' + currentYear + '年' + currentMonth + '月）';
                        var chartTitle = '机床整体数据统计图' + dateStr;

                        var redTime = 0;
                        var greenTime = 0;
                        var yellowTime = 0;
                        var purpleTime = 0;
                        var keysArray = obj.keys;
                        if (keysArray != null && keysArray != undefined && keysArray.length > 0) {
                            for (var i = 0; i < keysArray.length; i++) {
                                redTime += obj.datas[keysArray[i]].red;
                                greenTime += obj.datas[keysArray[i]].green;
                                yellowTime += obj.datas[keysArray[i]].yellow;
                                purpleTime += obj.datas[keysArray[i]].purple;
                            }
                        }
                        redTime = parseInt(redTime / 60, 10);
                        greenTime = parseInt(greenTime / 60, 10);
                        yellowTime = parseInt(yellowTime / 60, 10);
                        purpleTime = parseInt(purpleTime / 60, 10);

                        var redData = [];
                        var greenData = [];
                        var yellowData = [];
                        var purpleData = [];
                        var xTimeArr = [];
                        redData.push(redTime);
                        greenData.push(greenTime);
                        yellowData.push(yellowTime);
                        purpleData.push(purpleTime);
                        xTimeArr.push(currentYear + '-' + numberProcess(currentMonth) + '-01');

                        // 指定图表的配置项和数据
                        var option = {
                            title: {
                                text: chartTitle,
                                subtext: '单位：分钟',
                                x: 'center'
                            },
                            grid: {
                                top: '20%'
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            color: ['#CC0033', '#CCCC33', '#66CC99'],
                            legend: {
                                data: ['故障时间', '待机时间', '工作时间'],
                                top: 60
                            },
                            xAxis: [{
                                data: xTimeArr,
                                type: 'category'
                            }],
                            yAxis: [{
                                type: 'value'
                            }],
                            series: [{
                                name: '故障时间',
                                type: 'line',
                                data: redData,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                            }, {
                                name: '待机时间',
                                type: 'line',
                                data: yellowData,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            }, {
                                name: '工作时间',
                                type: 'line',
                                data: greenData,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            }]
                        };

                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                    }

                    //显示饼状图
                    function showPieCharts(obj) {
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(document.getElementById('main'));

                        var dateNow = getTimeNow();
                        var dateStr = '（' + currentYear + '年' + currentMonth + '月）';
                        var chartTitle = '机床整体数据统计图' + dateStr;

                        var redTime = 0;
                        var greenTime = 0;
                        var yellowTime = 0;
                        var purpleTime = 0;
                        var keysArray = obj.keys;
                        if (keysArray != null && keysArray != undefined && keysArray.length > 0) {
                            for (var i = 0; i < keysArray.length; i++) {
                                redTime += obj.datas[keysArray[i]].red;
                                greenTime += obj.datas[keysArray[i]].green;
                                yellowTime += obj.datas[keysArray[i]].yellow;
                                purpleTime += obj.datas[keysArray[i]].purple;
                            }
                        }
                        redTime = parseInt(redTime / 60, 10);
                        greenTime = parseInt(greenTime / 60, 10);
                        yellowTime = parseInt(yellowTime / 60, 10);
                        purpleTime = parseInt(purpleTime / 60, 10);

                        var totalTime = redTime + greenTime + yellowTime + purpleTime;
                        var otherTime = 0;
                        if(machineCount != 0) {
                            if(currentMonth != (new Date().getMonth() + 1)) {
                                otherTime = machineCount * 24 * 60 * getDaysOfMonth(currentYear, currentMonth) - totalTime;
                            }else {
                                otherTime = machineCount * 24 * 60 * (new Date().getDate() - 1) - totalTime;
                            }
                        }

                        var legendData = ['工作时间', '待机时间', '故障时间', '其他时间'];
                        var seriesData = [{
                            value: greenTime,
                            name: '工作时间'
                        }, {
                            value: yellowTime,
                            name: '待机时间'
                        }, {
                            value: redTime,
                            name: '故障时间'
                        }, {
                            value: otherTime,
                            name: '其他时间'
                        }];

                        var pieOption = {
                            title: {
                                text: chartTitle,
                                subtext: '单位：分钟',
                                x: 'center'
                            },
                            tooltip: {
                                trigger: 'item'
                            },
                            color: ['#66CC99', '#CCCC33', '#CC0033', '#888888'],
                            legend: {
                                orient: 'horizontal',
                                top: 60,
                                data: legendData
                            },
                            series: [{
                                name: '时间',
                                type: 'pie',
                                radius: '55%',
                                data: seriesData
                            }]
                        };
                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(pieOption);
                    }

                    //获取机器总台数
                    function getMachineCount() {
                        var workshopCount = 0;
                        var loadedWorkshopCount = 0;
                        getWorkshops();
                        //获取所有的车间
                        function getWorkshops() {
                            $.ajax({
                                type: 'GET',
                                async: 'false',
                                url: requestBaseUrl + 'iot/companies/workshops',
                                headers: {
                                    'Authorization': 'Bearer ' + getToken()
                                },
                                success: function(response) {
                                    console.log('车间信息：' + JSON.stringify(response));
                                    if (response.status == 10001) {
                                        if (response.data.total > 0) {
                                            workshopCount = response.data.total;
                                           var workshopList = response.data.list;
                                            for(var i = 0; i < workshopList.length; i++) {
                                                getMachinesByWorkshopId(workshopList[i].id);
                                            }
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
                                    // $.toast('加载车间列表出错' + textStatus);
                                    vueThis.$message('加载车间列表出错' + textStatus)
                                }
                            })
                        }
                        //获取车间中的机器
                        function getMachinesByWorkshopId(workshopId) {
                            $.ajax({
                                type: 'GET',
                                async: 'false',
                                url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines',
                                headers: {
                                    'Authorization': 'Bearer ' + getToken()
                                },
                                success: function(response) {
                                    loadedWorkshopCount++;
                                    // console.log('machine list: ' + JSON.stringify(response));
                                    // console.error('loaded workshop count: ' + loadedWorkshopCount + ', workshop count = ' + workshopCount);
                                    // $.hidePreloader();
                                    if(response.status == 10001) {
                                        machineCount += response.data.total;
                                    }else{
                                        // $.toast('获取机床列表失败' + response.status);
                                        vueThis.$message('获取机床列表失败' + response.status)
                                    }
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    // $.hidePreloader();
                                    // $.toast('加载机床列表出错' + textStatus);
                                    vueThis.$message('加载机床列表出错' + textStatus)
                                }
                            });
                        }
                    }
                }
            }
    
    </script>
