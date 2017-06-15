<style type="text/css">
	canvas {
		background-color: #FFFFFF;
		width: 100%
	}
	.center-text {
		text-align: center;
	}
	#title {
		font-size: 20px;
		font-weight: bold;
	}
	#subtitle {
		font-size: 16px;
	}
	.content-block{
		margin-top:2rem;
	}
	.lookTime{
    	text-align: center;
    	width: 35%!important;
		height: 30px;
		font-size: 16px;
		border-radius: 5px;
		box-shadow:none;
		-webkit-box-shadow:none;
		border: 1px solid #19b5ee;
    }
    .lookTime:focus{
    	border-color:#66CCFF;
    }
	#lookBtn,#lookBtn2{
		width:5rem;
		height:1.5rem;
		line-height:1.5rem;
		background:#fff;
	}
	.pBtn{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		-webkit-justify-content: center;
		margin-top:1rem;
	}
	#timeLineContent{
		padding:.5rem;
	}
	#slider{
		width:90%!important;
	}
	
</style>
<template>
	<div id="app">
		<div class="content" id="timeLineContent">
			<p id="title" class="center-text"></p>
			<p id="subtitle" class="center-text"></p>
			<canvas id="canvas" ></canvas>
			<div id="slider"></div>
			  <mt-datetime-picker ref="picker1" type="time" v-model="value2" @confirm="handleConfirm1">
			  </mt-datetime-picker>
			  <mt-datetime-picker ref="picker2" type="time" v-model="value3" @confirm="handleConfirm2">
			  </mt-datetime-picker>
			  <mt-datetime-picker ref="picker3" type="time"v-model="value4" @confirm="handleConfirm3">
			  </mt-datetime-picker>
			  <mt-datetime-picker ref="picker4" type="time" v-model="value5" @confirm="handleConfirm4">
			  </mt-datetime-picker>
				<div class="look" style='margin-top: 1rem;'> 
				查看 <input @click='openPicker1' class="lookTime start" placeholder="选择开始时间" readonly :value=value2>-<input @click='openPicker2' class="lookTime end" placeholder="选择结束时间" readonly :value=value3>
				<p class="pBtn"><a href="javascript:;" class="button button-round" id='lookBtn'>查看</a></p>
			</div>
			<div class="look2" style='margin-top: 1rem;display:none;;'> 
				查看 <input @click='openPicker3' class="lookTime start2" placeholder="选择开始时间" readonly :value=value4>-<input class="lookTime end2" @click='openPicker4' placeholder="选择结束时间" readonly :value=value5>
				<p class="pBtn"><a href="javascript:;" class="button button-round" id='lookBtn2'>查看</a></p>
			</div>
			<div class="content-block">
		        <div class="row">
		            <div class="col-50"><a id="btn-pre-day" class="button button-big button-fill button-danger">前一天</a></div>
		            <div class="col-50"><a id="btn-next-day" class="button button-big button-fill button-success">后一天</a></div>
		        </div>
		    </div>
		</div>
	</div>
</template>

    <script type="text/javascript">
	     export default {
	            data(){
	                return {
	                    value1:'',
	                    value2:'',
	                    value3:'',
	                    value4:'',
	                    value5:''	                   	                  
	                }
	            },
	            methods:{
			      openPicker1() {
			        this.$refs.picker1.open();
			      },
			      handleConfirm1(e){
			      	console.log(e)
			      },
			      openPicker2() {
			        this.$refs.picker2.open();
			      },
			      handleConfirm2(e){
			      	console.log(e)
			      },
			      openPicker3() {
			        this.$refs.picker3.open();
			      },
			      handleConfirm3(e){
			      	console.log(e)
			      },
			      openPicker4() {
			        this.$refs.picker4.open();
			      },
			      handleConfirm4(e){
			      	console.log(e)
			      }
	            },
	            mounted:function(){
	            	$("#titleName").text('机床时间轴统计图');
	            	// linked-list
	            	function ListNode(val, next) {
						this.val = val;
						this.next = next;
					}

					function LinkedList() {
						this.head = null;
						this.length = 0;
						this.createList = function(arr) {
							if(arr != null && arr.length > 0) {
								this.length = arr.length;	
								this.head = new ListNode(arr[0], null);
								var p = this.head;
								for(var i = 1; i < arr.length; i++) {
									var node = new ListNode(arr[i], null);
									p.next = node;
									p = node;
								}
							}
						}
						this.showList = function() {
							var p = this.head;
							var str = '';
							while(p != null) {
								str += p.val + ' ';
								p = p.next;
							}
							console.log(str);
						}
						this.insert = function(index, val) {
							if(this.head == null) {
								this.head = new ListNode(val, null);
							} else if(index > this.length - 1) {
								var node = new ListNode(val, null);
								var p = this.head;
								while(p.next != null) p = p.next;
								p.next = node;
							} else if(index == 0) {
								var node = new ListNode(val, null);
								node.next = this.head;
								this.head = node;
							} else {
								var p = this.head;
								for(var i = 0; i < index - 1; i++) {
									p = p.next;
								}
								var next = p.next;
								var node = new ListNode(val, null);
								p.next = node;
								node.next = next;
							}
							++this.length;
						}
						this.toArray = function() {
							var arr = [];
							var p = this.head;
							while(p != null) {
								arr.push(p.val);
								p = p.next;
							}
							return arr;
						}
					}
	                var vueThis=this
	                var workshopId = getUrlParam('workshopId');
			    	var machineId = getUrlParam('machineId');
			    	var machineName = getUrlParam('machineName');
					var timelineDate = getTodayStartUnixTimestamp()+28800;
					var nowToday = getTodayStartUnixTimestamp()+28800;
					var dayNumber=0;

					$(".lookTime").focus(function(){
						return false
					})
					// 选择查看时间段
						function selectTime(timelineDate,dayNumber) {
							$("#lookBtn2").click(function(){
									var nowToday = timelineDate+86399;
									var newTime=nowToday;			
							       	var timeHour=(timelineDate-getTodayStartUnixTimestamp()+dayNumber*86400)/3600;
							       	if(vueThis.value4!=''&&vueThis.value5!=''){
							       		var lookStart =vueThis.value4.split(":")[0];
								       	var lookStart2=vueThis.value4.split(":")[1] ;
								       	var lookEnd =vueThis.value5.split(":")[0];
								       	var lookEnd2=vueThis.value5.split(":")[1];
							       	}
							       
							       	// 填写的开始时间（秒）
							       	var lookStartTime=timelineDate+lookStart*3600+lookStart2*60-28800; 
							       	// 填写的结束时间（秒）
							        var lookEndTime=timelineDate+lookEnd*3600+lookEnd2*60-28800;
							        // 判断时间是否小于初始开始时间，是则认为是第二天凌晨
							       if(lookStart<timeHour){
							       		lookStartTime=+lookStartTime+86400
							       		lookStart=+lookStart+24
							       	}
							       	if(lookEnd<timeHour){
							       		lookEndTime=+lookEndTime+86400
							       		lookEnd=+lookEnd+24
							       	};
							       if(vueThis.value4==''||vueThis.value5==''){
							       		vueThis.$message('时间不能为空');
							        }else if(lookEndTime>newTime||lookStartTime>newTime){
							       		vueThis.$message('时间还没到，请选择正确时间');	       
							       	}else if(lookStartTime<lookEndTime){
								       		var startTime=lookStart*3600+lookStart2*60+timelineDate-28800+59;
									        var endTime=lookEnd*3600+lookEnd2*60+timelineDate-28800+59;
									        var timeLength=86399;
									        var start=((startTime-timelineDate)/ timeLength)*100;
									        var end=((endTime-timelineDate)/timeLength)*100;
											slider.noUiSlider.set([start, end])		
											updateChart(start, end);
								    }
								    else if(lookEndTime==lookStartTime){
								    		vueThis.$message('开始时间不能等于结束时间')
								    }else{
								    		vueThis.$message('请填写正确时间')
								    }
								    // vueThis.value4='';
								    // vueThis.value5='';
							})
						}						     
			       // *******************************************
					// 当天选择查看时间段
			       $("#lookBtn").click(function(){
			        var newDate=new Date(),newHour=newDate.getHours()*3600,newMinutes=newDate.getMinutes()*60,newTime=newHour*3600+newMinutes*60+getTodayStartUnixTimestamp(); 
			       	var timeHour=(timelineDate-getTodayStartUnixTimestamp())/3600;
			       	var lookStart =vueThis.value2.split(":")[0];
			       	var lookStart2=vueThis.value2.split(":")[1];
			       	var lookEnd =vueThis.value3.split(":")[0];
			       	var lookEnd2=vueThis.value3.split(":")[1];
			       	// 填写的开始时间（秒）
			       	var lookStartTime=getTodayStartUnixTimestamp()+lookStart*3600+lookStart2*60; 
			       	// 填写的结束时间（秒）
			        var lookEndTime=getTodayStartUnixTimestamp()+lookEnd*3600+lookEnd2*60;
			        // 判断开始和结束时间是否为空
			        if(lookStart<timeHour){
			       		lookStartTime+=86400
			       		lookStart+=24
			       	}
			       	if(lookEnd<timeHour){
			       		lookEndTime+=86400
			       		lookEnd+=24
			       	};
			       	if(lookEndTime>newTime||lookStartTime>newTime){
			       		vueThis.$message('时间还没到，请选择正确时间')
			       	}else if(lookStartTime<lookEndTime) {
				       		var startTime=lookStart*3600+lookStart2*60+getTodayStartUnixTimestamp()+59;
					        var endTime=lookEnd*3600+lookEnd2*60+getTodayStartUnixTimestamp()+59;
					        var timeLength= parseInt(new Date().getTime() / 1000, 10)-timelineDate;
					        var start=((startTime-timelineDate)/ timeLength)*100;
					        var  end=((endTime-timelineDate)/timeLength)*100;
							slider.noUiSlider.set([start, end])	
							updateChart(start, end);	
			       	}else{
			       		vueThis.$message('请填写正确时间')
			       	}
			       	// vueThis.value2='';
			       	// vueThis.value3='';
			       })
			    	if(machineName != null && machineName != undefined && machineName != '') {
				        $('title').text(machineName + '    ' + getDateStr(timelineDate) + '时间轴统计图');
				        $('#title').text(machineName + '    ' + getDateStr(timelineDate) + '时间轴统计图');
				    }
				    var screenWidth = $(window).width();
				    var leftRightMargin = screenWidth / 20;

				    $('#canvas').attr('width', screenWidth);
				    $('#canvas').attr('height', 300);
				    $('#slider').css('width', screenWidth - 2 * leftRightMargin);
				    $('#slider').css('margin-left', leftRightMargin);
				    $('#slider').css('margin-right', leftRightMargin);

				    $('#subtitle').text(getDateStr(timelineDate));

				    $('a#btn-pre-day').click(function() {
				    	dayNumber+=1;
					    	if(dayNumber>0){
					    		$(".look").css("display","none")
					    		$(".look2").css("display","block")
					    	}else{
					    		$(".look").css("display","block")
					    		$(".look2").css("display","none")
					    	};
						timelineDate = timelineDate - 86400;
						selectTime(timelineDate,dayNumber);

						$('title').text(machineName + '    ' + getDateStr(timelineDate) + '时间轴统计图');
				        $('#title').text(machineName + '    ' + getDateStr(timelineDate) + '时间轴统计图');
				    	$('#subtitle').text(getDateStr(timelineDate));
						if(slider != undefined) {
							slider.noUiSlider.set([0, 100]);
						}
				    	getMachineStatisticsData(timelineDate);
				    })
				    $('a#btn-next-day').click(function() {
				    	dayNumber-=1;
				    	if(dayNumber<0){
				    		dayNumber=0
				    	}
				    	if(dayNumber>0){
				    		$(".look").css("display","none")
				    		$(".look2").css("display","block")
				    	}else{
				    		$(".look").css("display","block")
				    		$(".look2").css("display","none")
				    	};
						if(timelineDate == nowToday) {
							vueThis.$message('没有更多数据了')
							return ;
						}
						timelineDate = timelineDate + 86400;
						selectTime(timelineDate,dayNumber);

						$('title').text(machineName + '    ' + getDateStr(timelineDate) + '时间轴统计图');
				        $('#title').text(machineName + '    ' + getDateStr(timelineDate) + '时间轴统计图');
				    	$('#subtitle').text(getDateStr(timelineDate));
						if(slider != undefined) {
							slider.noUiSlider.set([0, 100]);
						}
						getMachineStatisticsData(timelineDate);
				    })
			    	
			    	var redArr, greenArr, yellowArr;
			    	var canvas = document.getElementById('canvas');
			    	var canvasRect = canvas.getBoundingClientRect();
			    	var context = canvas.getContext('2d');

			    	var startX = leftRightMargin;
			        var startY = 80;
			        var cellHeight = 100;
			        var canvasHeight = 300;
			        var curStart;
			        var curEnd;
			        var clickedTimeline = -1;
			        var clickedObj;

			        var slider = document.getElementById('slider');
			    	var sliderPreStart = 0;
			    	var sliderPreEnd = 100;
			    	var linkedList = new LinkedList();

			    	noUiSlider.create(slider, {
						start: [0, 100],
						handles: 2,
						margin: 1,
						connect: true,
						range: {
							min: 0,
							max: 100
						},
					});
			        slider.noUiSlider.on('set', function(values, handles) {
						var start = values[0];
						var end = values[1];
						if(start !== sliderPreStart || end !== sliderPreEnd) {
							//更新
							updateChart(start, end);
							sliderPreEnd = end;
							sliderPreStart = start;
						}
					})

			    	getMachineStatisticsData(nowToday);

			    	//获取机器当天的统计数据
			    	function getMachineStatisticsData(dayStartTime) {
			    		// $.showPreloader();
			    		$.ajax({
			    			type: 'GET',
			    			url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/datas',
			    			data: {
								day: dayStartTime
							},
							async:false,
			    			headers: {
			    				'Authorization': 'Bearer ' + getToken()
			    			},
			    			success: function(response) {
			    				// $.hidePreloader();
			    				if(response.status == 10001) {
			    					var data = response.data;
			    					//console.log('data: ' + formatJSON(JSON.stringify(data)));

			    					redArr = data.red;
			    					greenArr = data.green;
			    					yellowArr = data.yellow;

			    					showTimelineChart();
			    				}
			    			},
			    			error: function(jqXHR, textStatus, errorThrown) {
			    				// $.hidePreloader();
			    				// $.toast('获取机床统计数据出错');
			    				vueThis.$message('获取机床统计数据出错')
			    			}
			    		})
			    	}

			    	function showTimelineChart() {
			    		var seriesData = [];
			    		if(greenArr != null) {
					        for(var i = 0; i < greenArr.length; i++) {
					        	seriesData.push({
					        		name: '工作时间',
					        		start: greenArr[i].start,
					        		end: greenArr[i].end,
					        		data: greenArr[i].end - greenArr[i].start,
					        	})
					        }
					    }
					    if(yellowArr != null) {
					        for(var i = 0; i < yellowArr.length; i++) {
					        	seriesData.push({
					        		name: '待机时间',
					        		start: yellowArr[i].start,
					        		end: yellowArr[i].end,
					        		data: yellowArr[i].end - yellowArr[i].start,
					        	})
					        }
					    }
					    if(redArr != null) {
					        for(var i = 0; i < redArr.length; i++) {
					        	seriesData.push({
					        		name: '故障时间',
					        		start: redArr[i].start,
					        		end: redArr[i].end,
					        		data: redArr[i].end - redArr[i].start,
					        	})
					        }
					    }

						var todayStart = timelineDate;
					    var todayEnd = todayStart + 86399;

					    if(seriesData.length == 0) {
					    	//没有数据，灯的数据全部为null的情况
					    	context.fillStyle = '#888888';
					    	context.fillRect(startX, startY, (screenWidth - 2 * leftRightMargin), cellHeight);
					    	seriesData.push({
								name: '其他时间',
				        		start: todayStart,
				        		end: todayEnd,
				        		data: 86399,
					    	})
					    } else {
					    	//有数据，则将数据排序
					    	seriesData.sort(function (a, b) {
					        	if(a.start > b.start) {
					        		return 1;
					        	} else if(a.start < b.start) {
					        		return -1;
					        	}
					        	return 0;
					        });
					    }
				       
				        linkedList.createList(seriesData);
				        // var pp = linkedList.head;
				        // while(pp != null) {
				        // 	console.log('before insert: ' + JSON.stringify(pp.val));
				        // 	pp = pp.next;
				        // }

				        // console.log('-----------------------------');
				        
				        var curTime;
				        if(todayStart == nowToday) {
					    	curTime = parseInt(new Date().getTime() / 1000, 10);
					    } else {
					    	curTime = todayEnd;
					    }

				        var p = linkedList.head;
				        var index = 1;
				        if(p.val.start > todayStart) {
				        	linkedList.insert(0, {
				        		name: '其他时间',
				        		start: todayStart,
				        		end: p.val.start,
				        		data: p.val.start - todayStart,
				        	})
				        	++index;
				        }
				        while(p.next != null) {
				        	var next = p.next;
				    		if(p.val.end < next.val.start) {
				        		linkedList.insert(index, {
				        			name: '其他时间',
					        		start: p.val.end,
					        		end: next.val.start,
					        		data: next.val.start - p.val.end,
					        		insert: true		
				        		})
				        	}
				        	index++;
				        	p = p.next;
				        }
				        if(p != null && p.val.end < curTime) {
				        	linkedList.insert(index, {
				        		name: '其他时间',
				        		start: p.val.end,
				        		end: curTime,
				        		data: curTime - p.val.end,
				        		insert: true
				        	})
				        }

				        var cellWidth = (screenWidth - 2 * leftRightMargin) / (curTime - todayStart);
				        var widthHasDrawn = 0;

				        context.clearRect(0, 0, screenWidth, canvasHeight);
				        p = linkedList.head;
				        while(p) {
				        	var obj = p.val;
				        	// if(obj.insert) {
				        	// 	console.error('insert: ' + JSON.stringify(obj));
				        	// } else {
				        	// 	console.log('obj: ' + JSON.stringify(obj));
				        	// }
				        	if(obj.name == '待机时间') {
				        		context.fillStyle = '#CCCC33';
				        	} else if(obj.name == '故障时间') {
				        		context.fillStyle = '#CC0033';
				        	} else if(obj.name == '工作时间') {
				        		context.fillStyle = '#66CC99';
				        	} else {
				        		context.fillStyle = '#888888';
				        	}
				        	context.fillRect(startX + widthHasDrawn, startY, cellWidth * obj.data, cellHeight);
				        	widthHasDrawn += cellWidth * obj.data;
				        	if(widthHasDrawn > (screenWidth - 2 * leftRightMargin)) {
				        		widthHasDrawn = (screenWidth - 2 * leftRightMargin);
				        	}
				        	p = p.next;
				        }
				       
				        drawTimeLabel(todayStart, curTime);
				        curStart = todayStart;
				        curEnd = curTime;
			    	}

			    	function updateChart(start, end) {
			    		var todayStart = timelineDate;
					    var todayEnd = todayStart + 86399;
					    var curTime;
					    if(todayStart == nowToday) {
					    	curTime = parseInt(new Date().getTime() / 1000, 10);
					    } else {
					    	curTime = todayEnd;
					    }
				        start = todayStart + (start * (curTime - todayStart) / 100);
				        end = todayStart + (end * (curTime - todayStart) / 100);
				        if(end > curTime) {
				        	end = curTime;
				        }
				        var widthHasDrawn = 0;
				        var cellWidth = (screenWidth - 2 * leftRightMargin) / (end - start);
				        context.clearRect(0, 0, screenWidth, canvasHeight);
				        var p = linkedList.head;
				        while(p != null) {
				        	var obj = p.val;
				        	if(obj.name == '待机时间') {
				        		context.fillStyle = '#CCCC33';
				        	} else if(obj.name == '故障时间') {
				        		context.fillStyle = '#CC0033';
				        	} else if(obj.name == '工作时间') {
				        		context.fillStyle = '#66CC99';
				        	} else {
				        		context.fillStyle = '#888888';
				        	}
				        	var delta = 0;
				        	if(clickedTimeline >= obj.start && clickedTimeline <= obj.end) {
				        		delta = 10;
				        		clickedObj = obj;
				        	}
				        	if(obj.start >= start && obj.end <= end) {
				        		context.fillRect(startX + widthHasDrawn, startY - delta, cellWidth * obj.data, cellHeight + 2 * delta);	
				        		widthHasDrawn += cellWidth * obj.data;
				        	} else if(obj.start < start && obj.end > start) {
				        		context.fillRect(startX + widthHasDrawn, startY - delta, cellWidth * (obj.end - start), cellHeight + 2 * delta);	
				        		widthHasDrawn += cellWidth * (obj.end - start);
				        	} else if(obj.end > end && obj.start < end) {
				        		context.fillRect(startX + widthHasDrawn, startY - delta, cellWidth * (end - obj.start), cellHeight + 2 * delta);	
				        		widthHasDrawn += cellWidth * (end - obj.start);
				        	}
				        	if(widthHasDrawn > (screenWidth - 2 * leftRightMargin)) {
				        		widthHasDrawn = (screenWidth - 2 * leftRightMargin);
				        	}
				        	p = p.next;
				        }
				        drawTimeLabel(start, end);
				        curStart = start;
				        curEnd = end;
			    	}

			    	function drawTimeLabel(startTime, endTime) {
			    		context.fillStyle = '#000000';
			    		var originFont = context.font;
			    		context.font = '16px Arial';
			    		var width = context.measureText('00:00').width;
			    		if(startTime == null) {
			    			context.fillText('00:00', leftRightMargin - width / 2, 210);	
			    		} else {
			    			context.fillText(parseTime(startTime), leftRightMargin - width / 2, 210);	
			    		}    		
			    		context.fillText(parseTime(endTime), screenWidth - leftRightMargin - width / 2, 210);
			    		context.font = originFont;
			    	}

			    	function parseTime(time) {
			    		var date = new Date(time * 1000);
			    		var hour = date.getHours();
			    		var minute = date.getMinutes();
			    		if(hour < 10) {
			    			hour = '0' + hour;
			    		}
			    		if(minute < 10) {
			    			minute = '0' + minute;
			    		}
			    		var str = hour + ':' + minute;
			    		return str;
			    	}

			    	$("#canvas").click(function(event){
			    		var x = event.clientX - canvasRect.left - leftRightMargin;
			    		var y = event.clientY - canvasRect.top - 100;
			    		if(x >= 0 && x <= screenWidth - 2 * leftRightMargin && y > 0 && y < cellHeight) {
			    			//点击区域在图表里，计算点击的哪个时间块
			    			clickedTimeline = curStart + (curEnd - curStart) * (x / (screenWidth - 2 * leftRightMargin));
			    			// console.log('clicked time: ' + parseTime(clickedTimeline));
			    			updateChart(sliderPreStart, sliderPreEnd);
			    			drawHint();
			    		}
			    	})

			    	function drawHint() {
			    		if(clickedObj != null) {
			    			var originFont = context.font;
							var str = clickedObj.name + ': ' + parseTime(clickedObj.start) + '--' + parseTime(clickedObj.end);
							var timeStr = secondToFormattedTime(clickedObj.end - clickedObj.start);
							str += '(' + timeStr + ')';
							context.fillStyle = '#000000';
							context.font = '18px Arial';
							var width = context.measureText(str).width;
							context.fillText(str, (screenWidth - width) / 2, 250);
							context.font = originFont;
						}
			    	}
	            }
	        }    	
    </script>