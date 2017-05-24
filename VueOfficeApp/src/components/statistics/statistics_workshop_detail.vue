<style type="text/css">
    .chart-content {
        width: 100%;
        height: 500px;
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
        var echarts=require('echarts');
         export default {
                  data(){
                    return {
                    }
                },
                mounted:function(){
                    var vueThis=this;
                    var workshopId = vueThis.$parent.workshopId;
                    var workshopName = vueThis.$parent.workshopName;
                    var machineCount = vueThis.$parent.machineCount;
                    machineCount = parseInt(machineCount, 10);
                    var date = new Date();
                    var todayStartTime = getDayStartUnixTimestamp(date.getFullYear(), date.getMonth() + 1, date.getDate());
                    var monthStartTime = getStartEndTime(date.getFullYear(), date.getMonth() + 1).start_time;
                    var currentTime = parseInt(date.getTime() / 1000, 10);
                    var currentMonth = monthNow;
                    var currentYear = yearNow;
                    var currentData;
                    var startTime,endTime;
                    // console.error('machineCount: ' + machineCount);
                    console.log('todayStartTime: ' + todayStartTime);
                    console.log('monthStartTime: ' + monthStartTime);

                    getMonthStatisticData(monthStartTime, currentTime);

                    var isShowLineCharts = true;
                    $('#tab-menu1').click(function() {
                        $(this).addClass('active');
                        $('#tab-menu2').removeClass('active');
                        isShowLineCharts = true;
                        showMonthLineCharts(currentData);
                    });

                    $('#tab-menu2').click(function() {
                        $(this).addClass('active');
                        $('#tab-menu1').removeClass('active');
                        isShowLineCharts = false;
                        showMonthPieCharts(currentData);
                    });

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
                        getMonthStatisticData(startTime, endTime);
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
                        getMonthStatisticData(startTime, endTime);
                    });

                    //获取当天的统计数据
                    // function getTodayStatisticData() {
                    //     $.ajax({
                    //         type: 'GET',
                    //         url: requestBaseUrl + 'iot/companies/machines/datas',
                    //         headers: {
                    //             'Authorization': 'Bearer ' + getToken()
                    //         },
                    //         data: {
                    //             workshop_id: workshopId,
                    //             start_time: todayStartTime,
                    //             end_time: currentTime
                    //         },
                    //         success: function(response) {
                    //             console.log('get today statistics data: ' + formatJSON(JSON.stringify(response)));
                    //         },
                    //         error: function(xhr) {

                    //         }
                    //     })
                    // }

                    //获取本月的统计数据
                    function getMonthStatisticData(startTime, endTime) {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/machines/datas',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: {
                                workshop_id: workshopId,
                                start_time: startTime,
                                end_time: endTime
                            },
                            success: function(response) {
                                console.log('get month statistics data: ' + formatJSON(JSON.stringify(response)));
                                if (response.status == 10001) {
                                    currentData = response.data;
                                    if (isShowLineCharts) {
                                        showMonthLineCharts(response.data);
                                    } else {
                                        showMonthPieCharts(response.data);
                                    }
                                }
                            },
                            error: function(xhr) {
                                // $.toast('获取车间月统计数据出错' + xhr.status);
                                vueThis.$message('获取车间月统计数据出错'+xhr.status)
                            }
                        })
                    }

                    //显示月统计数据折线图
                    function showMonthLineCharts(obj) {
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
                        var chartTitle = workshopName + '月数据统计图' + dateStr;

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

                    //显示月统计数据饼状图
                    function showMonthPieCharts(obj) {
                        // 基于准备好的dom，初始化echarts实例
                        var myChart = echarts.init(document.getElementById('main'));

                        var dateNow = getTimeNow();
                        var dateStr = '（' + currentYear + '年' + currentMonth + '月）';
                        var chartTitle = workshopName + '月数据统计图' + dateStr;

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

                        console.log('redTime = ' + redTime);
                        console.log('greenTime = ' + greenTime);
                        console.log('yellowTime = ' + yellowTime);

                        var totalTime = redTime + greenTime + yellowTime + purpleTime;
                        var otherTime = 0;
                        if (machineCount != 0) {
                            if(currentMonth != (new Date().getMonth() + 1)) {
                                otherTime = machineCount * 24 * 60 * getDaysOfMonth(currentYear, currentMonth) - totalTime;
                            }else {
                                otherTime = machineCount * 24 * 60 * (new Date().getDate() - 1) - totalTime;
                            }
                        }
                        console.log('otherTime = ' + otherTime);
                        console.log('machineCount = ' + machineCount);

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
                }
            }
    
    </script>
