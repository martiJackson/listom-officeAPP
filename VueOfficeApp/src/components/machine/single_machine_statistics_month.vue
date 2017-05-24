<style type="text/css">
    .chart-content {
        width: 100%;
        height: 500px;
    }
</style>
<template>
    <div id="app">
        <div class="content">
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
              return {}
          },
          mounted:function(){
            var vueThis=this
            var workshopId = getUrlParam('workshopId');
            var machineId = getUrlParam('machineId');
            var machineName = getUrlParam('machineName');
            var currentMonth = monthNow;
            var currentYear = yearNow;
            if(machineName != null && machineName != undefined && machineName != '') {
                $('title').text(machineName + '月统计数据');
            }
            var startTime = getStartEndTime(yearNow, monthNow).start_time; //本月的开始时间
            var endTime = parseInt(new Date().getTime() / 1000, 10); //当前的时间
            getMachineStatisticsData(startTime, endTime);

            //显示上个月
            $('a#btn-pre-month').click(function() {
                if(currentMonth == 1) {
                    currentMonth = 12;
                    currentYear--;
                }else {
                    currentMonth--;
                }
                startTime = getStartEndTime(currentYear, currentMonth).start_time;
                endTime = getStartEndTime(currentYear, currentMonth).end_time;
                getMachineStatisticsData(startTime, endTime);            
            });

            //显示下个月
            $('a#btn-next-month').click(function() {
                if(currentMonth >= monthNow && currentYear >= yearNow) {
                    // $.alert('还没到下个月', '提示');
                    vueThis.$message('还没到下个月')
                    return ;
                }
                if(currentMonth == 12) {
                    currentMonth = 1;
                    currentYear++;
                }else {
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
                        machine_id: machineId,
                        start_time: startTime,
                        end_time: endTime
                    },
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // $.hidePreloader();
                        console.log('获取到机器统计数据：' + formatJSON(JSON.stringify(response)));
                        if(response.status == 10001) {
                            showLineCharts(response.data);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // $.hidePreloader();
                        console.log('获取机器统计数据失败：');
                    }
                })
            }

            //显示折线图
            function showLineCharts(obj) {
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
                var dayCount = (dateNow.month == currentMonth && dateNow.year == currentYear) 
                                    ? dayNow : getDaysOfMonth(currentYear, currentMonth);
                var todayDate = yearNow + '-' + numberProcess(monthNow) + '-' + numberProcess(dayNow);
                for(var i = 1; i <= dayCount; i++) {
                    var date = currentYear + '-' + numberProcess(currentMonth) + "-" + numberProcess(i);
                    if(date == todayDate) {
                        continue;
                    }
                    xTimeArr.push(date);
                    if(timeArr == null || timeArr.indexOf(date) == -1) {
                        redData.push(0);
                        greenData.push(0);
                        yellowData.push(0);
                        purpleData.push(0);
                    }else {
                        redTime = parseInt(obj.datas[date].red / 60);
                        if(redTime < 0) redTime *= -1;
                        redData.push(redTime);
                        greenTime = parseInt(obj.datas[date].green / 60);
                        if(greenTime < 0) greenTime *= -1;
                        greenData.push(greenTime);
                        yellowTime = parseInt(obj.datas[date].yellow / 60);
                        if(yellowTime < 0) yellowTime *= -1;
                        yellowData.push(yellowTime);
                        purpleTime = parseInt(obj.datas[date].purple / 60);
                        if(purpleTime < 0) purpleTime *= -1;
                        purpleData.push(purpleTime);
                    }
                }

                var dataZoom = null;
                if(xTimeArr.length > 4) {
                    //如果月份个数大于4，则使用dataZoom控件
                    dataZoom = [{
                        type: 'slider',
                        end: 100,
                        start: 60,
                        zoomLock: false,
                        handleSize: 20
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
                    }
                ];
            }

                var dateNow = getTimeNow();
                var dateStr = '（' + currentYear + '年' + currentMonth + '月）';
                var chartTitle = '机床' + machineName + '数据统计图' + dateStr; 

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
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                        },
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
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
              }
          }
    	
        }
    </script>