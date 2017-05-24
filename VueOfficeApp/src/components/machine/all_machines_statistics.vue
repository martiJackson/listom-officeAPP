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
                var workshopCount = 0; //总车间数
                var machineList = []; //机床列表
                var loadedWorkshopSize = 0; //已加载的车间个数
                var loadedMachineSize = 0; //已加载的机器个数
                getWorkshops();
                //获取所有的车间
                function getWorkshops() {
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
                                  var  workshopList = response.data.list;
                                    workshopCount = workshopList.length;
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
                            loadedWorkshopSize++;
                            console.log(workshopName + '机器数据：\n' + formatJSON(JSON.stringify(response)));
                            if(response != undefined && response != null && response != '') {
                                if(response.status == 10001) {
                                    var list = response.data.list;
                                    if(list != null && list != undefined && list != '') {
                                        for(var i = 0; i < list.length; i++) {
                                            var obj = list[i];
                                            var item = {
                                                machineName: obj.name,
                                                machineId: obj.id
                                            };
                                          machineList.push(item);
                                        }       
                                    }
                                }else {
                                    console.log('获取车间机床信息出错code = ' + response.status);
                                }
                            }
                            if(loadedWorkshopSize == workshopCount) {
                                console.log('load complete!\n' + formatJSON(JSON.stringify(machineList)));
                                //所有机床加载完毕后，再依次取每台机器的统计数据
                                for(var i = 0; i < machineList.length; i++) {
                                    getMachineStatisticsData(machineList[i]);
                                }
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log('加载机床列表出错');
                        }
                    })
                }

                //获取机器某一天的运行状态数据
                function getMachineStatisticsData(machineItem) {
                    
                    $.ajax({
                        type: 'GET',
                        url: requestBaseUrl + 'iot/companies/machines/' + machineItem.machineId + '/datas',
                        headers: {
                            'Authorization': 'Bearer ' + getToken()
                        },
                        data: {
                            day: getTodayStartUnixTimestamp(),
                            is_today: 1
                        },
                        success: function(response) {
                            loadedMachineSize++;
                            if(response != null && response != undefined && response != '') {
                                if(response.status == 10001) {
                                    var data = response.data;
                                    machineItem.greenTime = getMinutes(data.green);
                                    machineItem.yellowTime = getMinutes(data.yellow);
                                    machineItem.redTime = getMinutes(data.red);
                                }else {
                                    console.log('获取机床统计数据出错' + response.status);
                                }
                            }
                            if(loadedMachineSize == machineList.length) {
                                // console.log('所有机床统计数据都加载完毕: \n' + formatJSON(JSON.stringify(machineList)));

                                showBarChart();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log('get machine running data error! ' + textStatus);
                        }
                    })
                }

                //根据时间数组，获取分钟时间
                function getMinutes(dataArray) {
                    var totalTime = 0;
                    if(dataArray != null && dataArray != undefined) {
                        for(var i = 0; i < dataArray.length; i++) {
                            var obj = dataArray[i];
                            totalTime += (obj.end - obj.start);
                        }
                    }
                    return parseInt(totalTime / 60, 10);
                }

                //显示柱状图
                function showBarChart() {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('main'));
                    var redData = [];
                    var greenData = [];
                    var yellowData = [];
                    var otherData = [];
                    var xData = [];
                    for(var i = 0; i < machineList.length; i++) {
                        var obj = machineList[i];
                        xData.push(obj.machineName);
                        redData.push(obj.redTime);
                        yellowData.push(obj.yellowTime);
                        greenData.push(obj.greenTime);
                        otherData.push(Math.round(new Date().getTime() / 1000 / 60) - obj.redTime - obj.greenTime - obj.yellowTime - Math.round(getTodayStartUnixTimestamp() / 60));
                    } 

                    var dateNow = getTimeNow();
                    var dateStr = '（' + dateNow.yearStr + '年' + dateNow.monthStr + '月' + dateNow.dayStr + '日）';
                    var chartTitle = '机床整体当天数据统计图' + dateStr; 
                    var dataZoom = null;
                    if(machineList.length > 4) {
                        dataZoom = [{
                            style: 'slider',
                            end: 100,
                            start: 60,
                            zoomLock: false,
                            handleSize: 50
                        }];
                    }

                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: chartTitle,
                            subtext: '单位：分钟',
                            x: 'center',
                            textStyle: {
                                fontSize: 16
                            }
                        },
                        dataZoom: dataZoom,
                        grid: {
                            top: '20%'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        color: ['#66CC99', '#CCCC33', '#CC0033', '#888888'],
                        legend: {
                            data: ['工作时间', '待机时间', '故障时间', '其他时间'],
                            top: 60
                        },
                        xAxis: [{
                            data: xData,
                            type: 'category'
                        }],
                        yAxis: [{
                            type: 'value'
                        }],
                        series: [{
                            name: '工作时间',
                            type: 'bar',
                            data: greenData,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                        }, {
                            name: '待机时间',
                            type: 'bar',
                            data: yellowData,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                        }, {
                            name: '故障时间',
                            type: 'bar',
                            data: redData,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                        }, {
                            name: '其他时间',
                            type: 'bar',
                            data: otherData,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                        }]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);

                } 
              }
          }
    
    </script>

