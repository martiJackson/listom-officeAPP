
    <style type="text/css">
    .chart-content {
        width: 100%;
        height: 500px;
    }
    #last-time {
    	text-align: center;
    }
    </style>
    <template>
    	<div id="app">
    		<div class="content">
		        <div class="content-block">
		            <div class="buttons-row">
		                <a href="#tab1" class="tab-link active button" id="tab-menu1">饼状图</a>
		                <a href="#tab2" class="tab-link button" id="tab-menu2">柱状图</a>
		            </div>
		        </div>
		        <div id="main" class="chart-content"></div>
		        <div id="last-time"></div>
		    </div>
    	</div>
    </template>
	
    <script type="text/javascript">
        var echarts = require('echarts');
    	export default {
            data(){
                return {
                    value1:''
                }
            },
            mounted:function(){
                var vueThis=this
                var workshopId = getUrlParam('workshopId');
		    	var machineId =getUrlParam('machineId');
		    	var machineName = getUrlParam('machineName');
		    	console.log(workshopId+','+machineId+','+machineName)
		    	if(machineName != null && machineName != undefined && machineName != '') {
			        $('title').text(machineName + '今日统计数据');
			    }
		    	var redTime, greenTime, yellowTime, otherTime, firstGreenTime; //待机、正常工作、故障时间、其他时间，当日首次绿灯亮灯时间，单位：分钟
		    	getMachineStatisticsData();
		    	showLastTime();
		    	//获取机器当天的统计数据
		    	function getMachineStatisticsData() {
		    		$.ajax({
		    			type: 'GET',
		    			url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/datas',
		    			data: {
							day: getTodayStartUnixTimestamp(),
							is_today: 1
						},
						async:false,
		    			headers: {
		    				'Authorization': 'Bearer ' + getToken()
		    			},
		    			success: function(response) {
		    				console.log('get single machine statistics data: ' + formatJSON(JSON.stringify(response)));
		    				if(response.status == 10001) {
		    					var data = response.data;
								firstGreenTime = 0
								if (data.green != null){
									firstGreenTime = data.green[0].start
								}
		    					calculateTime('green', data.green);
		    					calculateTime('red', data.red);
		    					calculateTime('yellow', data.yellow);
		    					otherTime = Math.round(new Date().getTime() / 1000 / 60) 
		    									- redTime - greenTime - yellowTime - Math.round(getTodayStartUnixTimestamp() / 60);
		    					showPieCharts();
		    				}
		    			},
		    			error: function(jqXHR, textStatus, errorThrown) {
		    				// $.toast('获取机床统计数据出错');
		    				vueThis.$message('获取机床统计数据出错')
		    			}
		    		})
		    	}

		    	function calculateTime(color, dataArray) {
		    		var totalTime = 0;
		    		if(dataArray != null) {
			    		for(var i = 0; i < dataArray.length; i++) {
			    			var obj = dataArray[i];
			    			totalTime += obj.end - obj.start;
			    		}
			    	}
		    		totalTime = Math.round(totalTime / 60);
		    		if(color == 'green') {
		    			greenTime = totalTime;
		    		}else if(color == 'red') {
		    			redTime = totalTime;
		    		}else if(color == 'yellow') {
		    			yellowTime = totalTime;
		    		}
		    	}

			    $('#tab-menu1').click(function() {
			        $(this).addClass('active');
			        $('#tab-menu2').removeClass('active');
			        showPieCharts();
			    });

			    $('#tab-menu2').click(function() {
			        $(this).addClass('active');
			        $('#tab-menu1').removeClass('active');
			        showBarCharts();
			    });

			    //显示饼状图
			    function showPieCharts() {
			        // 基于准备好的dom，初始化echarts实例
			        var myChart = echarts.init(document.getElementById('main'));
			        var dataLabelFontSize = 30;

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
			                text: machineName + '机床数据统计图',
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

			    //显示柱状图
			    function showBarCharts(obj) {
			        // 基于准备好的dom，初始化echarts实例
			        var myChart = echarts.init(document.getElementById('main'));

			        // 指定图表的配置项和数据
			        var option = {
			            title: {
			                text: machineName + '机床数据统计图',
			                subtext: '单位：分钟',
			                x: 'center'
			            },
			            tooltip: {
		                    trigger: 'axis',
		                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		                    }
		                },
		                color: ['#66CC99', '#CCCC33', '#CC0033', '#888888'],
			            xAxis: {
			                data: ['工作时间', '待机时间', '故障时间', '其他时间']
			            },
			            yAxis: {},
			            series: [{
			                name: '时间',
			                type: 'bar',
			                data: [{
			                	value: greenTime,
			                	itemStyle: {
			                		normal: {
			                			color: '#66CC99'
			                		}
			                	}
			                }, {
			                	value: yellowTime,
			                	itemStyle: {
			                		normal: {
			                			color: '#CCCC33'
			                		}
			                	}
			                }, {
			                	value: redTime,
			                	itemStyle: {
			                		normal: {
			                			color: '#CC0033'
			                		}
			                	}
			                }, {
			                	value: otherTime,
			                	itemStyle: {
			                		normal: {
			                			color: '#888888'
			                		}
			                	}
			                }]
			            }]
			        };

			        // 使用刚指定的配置项和数据显示图表。
			        myChart.setOption(option);
			    }

			    //获取最后一次三个灯亮的时间
			    function showLastTime() {
			    	$.ajax({
			    		type: 'GET',
			    		url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/led/latest',
			    		headers: {
			    			'Authorization': 'Bearer ' + getToken()
			    		},
			    		success: function(response) {
			    			if(response != null && response.status == 10001) {
			    				console.error('last time: ' + JSON.stringify(response));
			    				var redTime = response.data.red;
			    				var yellowTime = response.data.yellow;
			    				var greenTime = response.data.green;
								var greenOffTime = response.data.green_off;
			    				var html = '';
			    				html += '<font color="#CC0033">上次故障时间：' + parseLastTime(redTime) + '</font><br/>';
			    				html += '<font color="#CCCC33">上次待机时间：' + parseLastTime(yellowTime) + '</font><br/>';
			    				html += '<font color="#66CC99">上次开始工作时间：' + parseLastTime(greenTime) + '</font><br/>';
								html += '<font color="#003333">上次停止工作时间：' + parseLastTime(greenOffTime) + '</font><br/>';
								html += '<font color="#339999">今日首次工作时间：' + parseLastTime(firstGreenTime) + '</font><br/>';
			    				$('#last-time').html(html);
			    			}
			    		},
			    		error: function(xhr) {
			    			console.log('获取最后一次亮灯时间失败：' + xhr.status);
			    		}
			    	})
			    }

			    function parseLastTime(unixTime) {
			    	if(isNaN(unixTime) || unixTime == 0) {
			    		return '暂无数据';
			    	}
			    	return getTimeStr(unixTime);
			    }
            }
        }
    	
    </script>