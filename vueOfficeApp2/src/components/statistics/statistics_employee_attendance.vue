
<style type="text/css">
.chart-content {
    width: 100%;
    height: 500px;
}
</style>
<template>
    <div class="content">
        <div class="content-block">
            <div class="buttons-row">
                <a href="#tab1" class="tab-link active button" id="tab-menu1">饼状图</a>
                <a href="#tab2" class="tab-link button" id="tab-menu2">柱状图</a>
            </div>
        </div>
        <div id="main" class="chart-content"></div>
    </div>
</template>
	
	<script type="text/javascript">
    var echarts = require('echarts');
      export default {
        data(){
          return {          
          }
        }
        ,mounted:function(){
            var vueThis=this;
            var data = {};
            getPersonalAttendance();

            //获取个人出勤数据
            function getPersonalAttendance() {
                $.ajax({
                    url: requestBaseUrl + 'companies/statistic/checkin/employees',
                    type: 'GET',
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    data: getStartEndTime(yearNow, monthNow),
                    success: function(response) {
                        console.log("response = " + JSON.stringify(response));
                        if (response.status == 10001) {
                            data = response.data;
                            showPieCharts(data);
                        } else {
                            // $.toast('获取数据失败');
                            vueThis.$message('获取数据失败')
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log("request error!");
                        // $.toast('获取数据失败');
                        vueThis.$message('获取数据失败')
                    }
                })
            }

            $('#tab-menu1').click(function(){
                $(this).addClass('active');
                $('#tab-menu2').removeClass('active');
                showPieCharts(data);
            });    

            $('#tab-menu2').click(function(){
                $(this).addClass('active');
                $('#tab-menu1').removeClass('active');
                showBarCharts(data);
            });

            //显示饼状图
            function showPieCharts(obj) {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));
                var dataLabelFontSize = 30;

                console.log("data = " + JSON.stringify(obj));

                var legendData = ['正常上下班', '迟到', '早退', '请假'];
                var seriesData = [{
                    value: obj.nomarl_check,
                    name: '正常上下班'
                }, {
                    value: obj.late_count,
                    name: '迟到'
                }, {
                    value: obj.early_count,
                    name: '早退'
                }, {
                    value: obj.leave_count,
                    name: '请假'
                }];

                var pieOption = {
                    title: {
                        text: '个人考勤数据统计图',
                        subtext: '单位：天',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'horizontal',
                        top: 60,
                        data: legendData
                    },
                    series: [{
                        name: '天数',
                        type: 'pie',
                        radius: '55%',
                        data: seriesData
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(pieOption);
            }

            //显示柱状图
            function showBarCharts(obj) {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));

                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '个人考勤数据统计图',
                        subtext: '单位：天',
                        x: 'center'
                    },
                    tooltip: {},
                    legend: {
                        data: ['天数'],
                        top: 60
                    },
                    xAxis: {
                        data: ['正常', '迟到', '早退', '请假']
                    },
                    yAxis: {},
                    series: [{
                        name: '天数',
                        type: 'bar',
                        data: [obj.nomarl_check, obj.late_count, obj.early_count, obj.leave_count]
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        }
    }   


    
    </script>
</body>
</html>
<!--