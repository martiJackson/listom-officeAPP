<template>
	<div id="app">
		<div class="content">
	        <div class="list-block">
	        <mt-datetime-picker
		     ref="picker1"
		     type="datetime"
		     v-model="pickerValue1"
		     @confirm="handleConfirm1">
		    </mt-datetime-picker>
		    <mt-datetime-picker
		     ref="picker2"
		     type="datetime"
		     v-model="pickerValue2"
		     @confirm="handleConfirm2">
		    </mt-datetime-picker>
		    <mt-datetime-picker
		     ref="picker3"
		     type="time"
		     v-model="pickerValue3"
		     @confirm="handleConfirm3">
		    </mt-datetime-picker>
	            <ul>
	            	<li>
	                    <div class="item-content">
	                        <div class="item-media"><i class="icon icon-app"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title label">工件名称</div>
	                            <div class="item-input">
	                                <input id="input-piece-name" type="text" placeholder="工件名称，可不填">
	                            </div>
	                        </div>
	                    </div>
	                </li>
	                <li>
	                    <div class="item-content">
	                        <div class="item-media"><i class="icon icon-clock"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title label">开始时间</div>
	                            <div class="item-input">
	                                <input id="input-start-time" type="text" @click='openPicker1' :value='startTime1' placeholder="选择开始时间" class="time-picker" readonly>
	                            </div>	  
	                        </div>
	                    </div>
	                </li>
	                <li>
	                    <div class="item-content">
	                        <div class="item-media"><i class="icon icon-clock"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title label">结束时间</div>
	                            <div class="item-input">
	                                <input id="input-end-time" type="text" @click='openPicker2' :value='endTime1' placeholder="选择结束时间" class="time-picker" readonly>
	                            </div>
	                        </div>
	                    </div>
	                </li>
	                <li>
	                    <div class="item-content">
	                        <div class="item-media"><i class="icon icon-clock"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title label">加工时间</div>
	                            <div class="item-input">
	                                <input id="input-per-time" type="text"  @click='openPicker3' :value='perTime1' placeholder="加工单个工件所用时间" readonly>
	                            </div>								  				
	                        </div>
	                    </div>
	                </li>
	            </ul>
	        </div>
	        <div class="content-block">
	            <div class="row">
	                <div class="col-50"><a href="javascript:;" id="btn-clear" class="button button-big button-fill button-danger">重置</a></div>
	                <div class="col-50"><a href="javascript:;" id="btn-submit" class="button button-big button-fill button-success">计算</a></div>
	            </div>
	        </div>
	        <div class="result">
	        	<div class="content-block-title">计算结果</div>
	        	<div class="list-block">
				    <ul>
				      <li class="item-content">
				        <div class="item-inner">
				          <div class="item-title">总加工时间</div>
				          <div id="total-time" class="item-after"></div>
				        </div>
				      </li>
				      <li class="item-content">
				        <div class="item-inner">
				          <div class="item-title">加工工件个数</div>
				          <div id="operate-count" class="item-after"></div>
				        </div>
				      </li>
				    </ul>
				  </div>
	        </div>
	    </div>
	</div>
</template>
<style type="text/css">

</style>
<script type="text/javascript">
    export default {
            data(){
              return {
              	value1:'',
              	value2:'',
              	value3:"",
              	startTime1:'',
              	endTime1:'',
              	perTime1:'',
              	pickerValue1:'',
              	pickerValue2:'',
              	pickerValue3:''
              }
          },
          methods:{
          	openPicker1() {
		        this.$refs.picker1.open();
		    },
		    openPicker2() {
		        this.$refs.picker2.open();
		    },
		    openPicker3() {
		        this.$refs.picker3.open();
		    },
		    handleConfirm1(e) {
		       this.startTime1=e.getFullYear()+'/'
  				+((e.getMonth()+1)>=10?(e.getMonth()+1):'0'+(e.getMonth()+1))+'/'
  				+(e.getDate()>=10?e.getDate():'0'+e.getDate())+' '
  				+(e.getHours()>=10?e.getHours():'0'+e.getHours())+':'
  				+(e.getMinutes()>=10?e.getMinutes():'0'+e.getMinutes());
		    },
		    handleConfirm2(e) {
		        this.endTime1=e.getFullYear()+'/'
  				+((e.getMonth()+1)>=10?(e.getMonth()+1):'0'+(e.getMonth()+1))+'/'
  				+(e.getDate()>=10?e.getDate():'0'+e.getDate())+' '
  				+(e.getHours()>=10?e.getHours():'0'+e.getHours())+':'
  				+(e.getMinutes()>=10?e.getMinutes():'0'+e.getMinutes());
		    },
		    handleConfirm3(e) {
		        this.perTime1=e;		       
		    }
          },
          mounted:function(){
          	$("titleName").text('加工计算器');
          	layer.closeAll();
          	var vueThis=this;
          	var machineId = getUrlParam("id");
	    	var machineName = getUrlParam("machineName");
	    	if(!isEmpty(machineName)) {
	    		$('title').html("加工计算器-" + machineName);
	    	}
	    	var startTime, endTime, perTime;

			var timeNow = getTimeNow();
			var year = timeNow.yearStr;
			var month = timeNow.monthStr;
			var day = timeNow.dayStr;
			var hours = timeNow.hourStr;
			var minutes = timeNow.minuteStr;
			var hoursArr = [];
			var minutesArr = [];
			var secondsArr = [];
			for(var i = 0; i < 24; i++) {
				hoursArr.push(i + "小时");
			}
			for(var i = 0; i < 60; i++) {
				minutesArr.push(i + "分钟");
				secondsArr.push(i + "秒");
			}
			//重置
			$('#btn-clear').click(function() {
				reset();
			});

			reset();
			function reset() {
				$("#input-piece-name").val('')
				vueThis.value1=''
				vueThis.value2=''
				vueThis.value3=''
				$('.result').hide();
			}
			//字符串转日期，字符串格式为yyyy-MM-dd HH:mm:ss
				function strToDate(str) {
				    var s = str.replace(/-/g,"/");
				    return new Date(s);
				}

				//字符串时间转Unix时间戳
				function strToUnixTimestamp(str) {
				    return strToDate(str).getTime() / 1000;
				}

			//计算
			$('#btn-submit').click(function() {
					startTime = vueThis.startTime1;
					endTime = vueThis.endTime1;
					perTime = vueThis.perTime1;
				if (isEmpty(perTime)) {
			        // $.toast('加工单个工件时间填写有误');
			        vueThis.$message('加工单个工件时间填写有误')
			        return;
			    }
				if(isEmpty(startTime) || isEmpty(endTime) || isEmpty(perTime)) {
					// $.alert('请将数据填写完整', '提示');
					vueThis.$message('请将数据填写完整')
					return ;
				}
				// startTime = startTime.replace(/-/g,"/");
			 //    endTime = endTime.replace(/-/g,"/");
			 	// var startYear=startTime.getFullYear(),
			 	// 	startMonth=startTime.getMonth()+1>10?startTime.getMonth()+1:"0"+(startTime.getMonth()+1),
			 	// 	startDate=startTime.getDate()>10?startTime.getDate():"0"+startTime.getDate(),
			 	// 	startHours=startTime.getHours()>10?startTime.getHours():'0'+startTime.getHours(),
			 	// 	startMinutes=startTime.getMinutes()>10?startTime.getMinutes():"0"+startTime.getMinutes(),
			 		
			 	// 	endYear=endTime.getFullYear(),
			 	// 	endMonth=endTime.getMonth()+1>10?endTime.getMonth()+1:'0'+(endTime.getMonth()+1),
			 	// 	endDate=endTime.getDate()>10?endTime.getDate():'0'+endTime.getDate(),
			 	// 	endHours=endTime.getHours()>10?endTime.getHours():'0'+endTime.getHours(),
			 	// 	endMinutes=endTime.getMinutes()>10?endTime.getMinutes():"0"+endTime.getMinutes();

			 	// startTime=startYear+"/"+startMonth+"/"+startDate+" "+startHours+":"+startMinutes;
			 	// endTime=endYear+"/"+endMonth+"/"+endDate+" "+endHours+":"+endMinutes
			 	// perTime=perTime.getHours()+"小时"+" "+perTime.getMinutes()+"分钟"+" "+perTime.getSeconds()+"秒"
			    // var reg = /^(\d+)小时 (\d+)分钟 (\d+)秒$/;
			    var reg = /^(\d+)小时 (\d+)分钟 $/;
			    var group = "";
			    var seconds = 0;			    
			    console.log("pertime: " + perTime);
			    // if(group = reg.exec(perTime)) {
			    // 	seconds += parseInt(group[1] * 60 * 60);
			    // 	seconds += parseInt(group[2] * 60);
			    // 	seconds += parseInt(group[3]);
			    // }
			    seconds=perTime.split(':')[0]*60*60+perTime.split(':')[1]*60+59;
			    if(seconds == 0) {
			    	// $.toast('请选择加工时间');
			    	vueThis.$message('请选择加工时间')
			    	return ;
			    }
			    console.log("加工一个工件所需时间：" + seconds + "秒");
			    // $.showPreloader('正在计算...');
			    vueThis.$message({
			    	message:'正在计算...',
			    	duration:0
			    });			    
			    $.ajax({
			    	type: 'GET',
			    	url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/time_datas',
			    	headers: {
			    		'Authorization': 'Bearer ' + getToken()
			    	},
			    	data: {
			    		start_time: strToUnixTimestamp(startTime + ':00'),
			            end_time: strToUnixTimestamp(endTime + ':00'),
			    	},
			    	success: function(response) {
			    		// $.hidePreloader();
			    		vueThis.$message.closeAll()
			    		console.log('calculate result: ' + JSON.stringify(response));
			    		if(!isEmpty(response) && response.status == 10001) {
			    			var green = response.data.green;
			    			var totalTime = (green / 60).toFixed(1);
		    				var amount = green / seconds;
		    				console.log("amount = " + amount);
		    				$('#operate-count').html(amount.toFixed(1) + "个"); 
		    				$('#total-time').html(totalTime + "分钟");
		    				$('.result').show();
			    		} else {
			    			// $.toast("计算出错");
			    			vueThis.$message("计算出错")	
			    		}
			    	},
			    	error: function(xhr) {
			    		// $.hidePreloader();
			    		// $.toast("计算出错");
			    		vueThis.$message.closeAll()
			    		vueThis.$message("计算出错")
			    		console.log("计算出错：" + xhr.status);
			    	}
			    })
			});
          }
      }
	
</script>
