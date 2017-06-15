<template>
    <div id='app'>
        <div class="content">
	        <div class="buttons-tab fixed-tab buttons-fixed">
	            <a href="#tab1" class="tab-link button active">请假记录</a>
	            <a href="#tab2" class="tab-link button">请假申请</a>
	            <a id="tab-check-leaves" href="#tab3" class="tab-link button">请假审核</a>
	        </div>
	        <div class="tabs">
	        	 <!-- 请假记录列表的模板 -->
	            <div id="tab1" class="tab active">
	                <div class="content-block tab-page-block" id="tab-page-list">
	                	<div class="list-block media-list" >

	                		<ul v-for="lis,index of list">
	                			<li class="item-content item-link list-item" @click="listItem(index)">
							        <div class="item-media">							   
								        <img class="item-img" v-if="lis.status == 0" src="static/images/ic_verify.png">
								        <img class="item-img" v-else if="lis.status == 1" src="static/images/ic_agree.png">
								        <img class="item-img" v-else src="static/images/ic_disagree.png">
							        </div>
							        <div class="item-inner">
								        <div class="item-title" id="type" >类型：{{lis.leave_type.name}}</div>
								        <div class="item-subtitle" id="reason">理由：{{lis.reason}}</div>
								        <div class="item-subtitle" id="result" style="display: none;" v-if="lis.status==0">审核结果：审核中</div>
								        <div class="item-subtitle" id="result" style="display: none;" v-else if="lis.status==1">审核结果：审核通过</div>
								        <div class="item-subtitle" id="result" style="display: none;" v-else>审核结果：审核不通过</div>							        
								        <div class="item-subtitle" id="time">时间：{{lis.start_time}}至{{lis.end_time}}</div>
							        </div>
						        </li>
	                		</ul>
	                	</div>
	                </div>
	            </div>
	            <!-- end -->
	            <!-- 请假申请 -->
	            <div id="tab2" class="tab">
		            <mt-datetime-picker
		              ref="picker"
					  v-model="pickerVisible"
					  type="datetime"
					  @confirm="handleConfirm">
					</mt-datetime-picker>
					<mt-datetime-picker
		              ref="picker2"
					  v-model="pickerVisible2"
					  type="datetime"
					  @confirm="handleConfirm2">
					</mt-datetime-picker>

	                <div class="content-block tab-page-block" id="tab-page-new">
	                    <div class="list-block">
	                        <ul>
	                            <li>
	                                <div class="item-content">
	                                    <div class="item-inner">
	                                        <div class="item-title label">请假类型</div>
	                                        <div class="item-input">
	                                            <!-- <input type="text" placeholder="选择请假类型" id="select-type"> -->
	                                             <el-autocomplete class="inline-input" v-model="state" :fetch-suggestions="querySearch"  placeholder="选择请假类型" ></el-autocomplete>
	                                        </div>
	                                    </div>
	                                </div>
	                            </li>
	                            <li>
	                                <div class="item-content">
	                                    <div class="item-inner">
	                                        <div class="item-title label">请假原因</div>
	                                        <div class="item-input">
	                                            <textarea id="leave-reason" placeholder="填写请假原因"></textarea>
	                                        </div>
	                                    </div>
	                                </div>
	                            </li>
	                            <li>
	                                <div class="item-content">
	                                    <div class="item-inner">
	                                        <div class="item-title label">开始时间</div>
	                                        <div class="item-input">
	                                            <input type="text" placeholder="请选择开始时间" :value='startTime1' readonly="" @click='openPicker' id="start-time-picker" class="date-picker">                                         
	                                        </div>
	                                    </div>
	                                </div>
	                            </li>
	                            <li>
	                                <div class="item-content">
	                                    <div class="item-inner">
	                                        <div class="item-title label">结束时间</div>
	                                        <div class="item-input">
	                                            <input type="text" placeholder="请选择结束时间" readonly="" :value='endTime1'  id="end-time-picker" class="date-picker" @click='openPicker2'>	                                             
	                                        </div>
	                                    </div>
	                                </div>
	                            </li>
	                            <li>
	                                <div class="item-content">
	                                    <div class="item-inner">
	                                        <div class="item-title label">请假小时</div>
	                                        <div class="item-input">
	                                            <input type="text" placeholder="填写请假小时" id="hours">
	                                        </div>
	                                    </div>
	                                </div>
	                            </li>
	                            <li>
	                                <div class="item-content">
	                                    <div class="item-inner">
	                                        <div class="item-title label">是否带薪</div>
	                                        <mt-switch v-model="switchValue" @change='changeBoolean'></mt-switch><span id="changePaid">不带薪</span>
	                                    </div>
	                                </div>
	                            </li>
	                            <li>
	                                <div class="item-content item-link">
	                                    <div class="item-inner">
	                                        <div class="item-title label">我的上级</div>
	                                        <div class="item-input">
	                                            <input type="text" readonly=true value="" id="my_leader">
	                                        </div>
	                                    </div>
	                                </div>
	                            </li>
	                            <!-- <li id="item-deliver">
	                                <div class="item-content item-link">
	                                    <div class="item-inner">
	                                        <div class="item-title label">抄送给</div>
	                                        <div class="item-input">
	                                            <input type="text" readonly=true placeholder="选择抄送对象(可为空)" id="deliver">
	                                        </div>
	                                    </div>
	                                </div>
	                            </li> -->
	                        </ul>
	                    </div>
	                    <div class="content-block">
	                        <div class="row">
	                            <div class="col-50"><a href="javascript:;" id="btn-clear" class="button button-big button-fill button-danger" @click="dialogVisible =true">重置</a></div>
	                            <div class="col-50"><a href="javascript:;" id="btn-submit" class="button button-big button-fill button-success" >提交</a></div>
	                        </div>
	                    </div>
	                </div>
	            </div>
	           <!--  end -->
	           <!-- 请假审核列表的模板 -->
	            <div id="tab3" class="tab">
	                <div class="content-block tab-page-block" id="tab-page-check-content" >
		                <div v-for='lis2,index of list2'>
		                	<div class="card" :id="'card-id-'+lis2.id">
						        <div class="card-header orange-color">{{lis2.user_name}}的请假申请</div>
						        <div class="card-content">				        
						        </div>
						        <div class="card-content-inner">
							        <span>原因：{{lis2.reason}}</span><br/>
							        <span>时间：{{lis2.start_time}}至{{lis2.end_time }}</span>
						        </div>
						        <div class="card-footer">
							        <a href="javascript:;" :id="lis2.id"  class="link agree"  @click='agree($event)'>同意</a>
							        <a href="javascript:;" :id="lis2.id" class="link disagree" @click='disagree($event)'>拒绝</a>
							        <a href="javascript:;" class="link" style="display:none;">发消息</a>
						        </div>
						    </div>
		                </div>
	                	
	                </div>
	            </div>
	            <!-- end -->
	        </div>
	    </div>
	    <el-dialog title="提示" v-model="dialogVisible" size='large'>
	    	<span>确认要清空填写的内容吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="clearForm">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="提示" v-model="dialog">
	    	<span>确定要同意该请假申请吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialog = false">取 消</el-button>
		    <el-button type="primary" @click="sureAgree">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="提示" v-model="dialog2">
	    	<span>确定要拒绝该请假申请吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialog2 = false">取 消</el-button>
		    <el-button type="primary" @click="sureDisagree">确 定</el-button>
		  </span>
		</el-dialog>

    </div>  
</template>
<style type="text/css">
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
color: #aaa!important; 
} 
.buttons-tab .button.active {
	color: #ff6101;
	border-color: #ff6101;
}
.list-item>.item-inner{
	text-align: left;
}
.orange-color {
    color: #ff6101;
}
.card{
	margin: .5rem;
}
.content-block{
	padding:0;
}
.card-content-inner{
	text-align: left;
}
.hint{
	margin-top:.4rem;
}
</style>
<script type="text/javascript">
  export default {
  	data(){
  		return {
  			content:'content',
  			list:'',
  			list2:'',
  			restaurants: [],
        	state: '',
        	pickerOptions0: {
	          disabledDate(time) {
	            return time.getTime() < Date.now() - 8.64e7;
	          }
	        }, 
	        switchValue:false, 
	        value1: '',
	        value2:'',
	        dialogVisible:false,
	        dialog:false,
	        dialog2:false,
	        isAgree:'',
	        isAgree2:'',
	        event:'',
	        pickerVisible:'',
	        pickerVisible2:'',
	        startTime1:'',
	        endTime1:''
  		}
  	},
  	methods:{
  			changeBoolean(e){
  				if(e){
  					$('#changePaid').html('带薪')
  				}else{
  					$('#changePaid').html('不带薪')
  				}
  			},
  			handleConfirm(e){
  				this.startTime1=e.getFullYear()+'/'
  				+((e.getMonth()+1)>=10?(e.getMonth()+1):'0'+(e.getMonth()+1))+'/'
  				+(e.getDate()>=10?e.getDate():'0'+e.getDate())+' '
  				+(e.getHours()>=10?e.getHours():'0'+e.getHours())+':'
  				+(e.getMinutes()>=10?e.getMinutes():'0'+e.getMinutes());
  				console.log(this.startTime1)
  			},
  			handleConfirm2(e){
  				this.endTime1=e.getFullYear()+'/'
  				+((e.getMonth()+1)>=10?(e.getMonth()+1):'0'+(e.getMonth()+1))+'/'
  				+(e.getDate()>=10?e.getDate():'0'+e.getDate())+' '
  				+(e.getHours()>=10?e.getHours():'0'+e.getHours())+':'
  				+(e.getMinutes()>=10?e.getMinutes():'0'+e.getMinutes());
  				console.log(this.thisTime1)
  			},   			
	  		openPicker() {
		        this.$refs.picker.open();
		     },
		     openPicker2() {
		        this.$refs.picker2.open();
		     },
  			agree(even){
  				this.dialog=true
  				even=this.event
  			},
  			disagree(even){
  				this.dialog2=true
  				even=this.event
  			},
  			sureAgree(){
  				this.isAgree(event)
  			},
  			sureDisagree(){
  				this.isAgree2(event)
  			},
  			// 显示请假详情
	  		listItem(index){
		    var type = $(".list-item").eq(index).find('#type').text();
		    var reason = $(".list-item").eq(index).find('#reason').text();
		    var time = $(".list-item").eq(index).find('#time').text();
		    var result = $(".list-item").eq(index).find('#result').text();
		    var content = type + '<br/>' + reason + '<br/>' + time + '<br/>' + result;	    
		    layer.open({
			  title: '请假详情'
			  ,content: content
			  ,btn:['确定']
			}); 
			$(".layui-m-layerchild>h3").css({'font-size':'20px','margin':0})//对话框标题字体和magin
			$(".layui-m-layercont").css({'text-align':'left','padding-top':0,'padding-bottom':'10px','font-size':'18px'}) //改变对话框内容样式
			$('.layui-m-layerbtn>span').css("font-size",'18px') //改变确定按钮字体大小
		},
		// 显示请假类型示
		 querySearch(queryString, cb) {
	        var restaurants = this.restaurants;
	        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
	        // 调用 callback 返回建议列表的数据
        	cb(results);    
      	},
	    createFilter(queryString) {
	        return (restaurant) => {
	          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
	        };
	      },
	      // 询问是否重置
	   clearForm(){
	   		this.switch=false;
	   		this.state='';
	   		this.startTime1='';
	   		this.endTime1='';
	   		$("#leave-reason").val('');
	   		$("#hours").val('');
	   		this.dialogVisible=false;
	   },
	   alertstate(){	   
	   return  {state:this.state,start:this.value1,end:this.value2}  	
	   }

  	},
  	mounted:function(){
  		 $("#titleName").text('请假申请');
  		var list='',list2='',vueThis=this;
  		if(getUrlParam('check')) {
	    //显示审核部分
	    $('.tab-link').removeClass('active');
	    $('.tab').removeClass('active');
	    $('#tab3').addClass('active');
	    $('#tab-check-leaves').addClass('active');
	}

	//判断是否是上级，上级有审核选项卡
	if (isBoss) {
	    //显示审核选项卡
	    $('#tab-check-leaves').css('display', '');
	    $('#tab3').css('display', '');
	} else {
	    //隐藏审核选项卡
	    $('#tab-check-leaves').css('display', 'none');
	    $('#tab3').css('display', 'none');
	}

	//是否带薪的CheckBox处理
	$("#salary-checkbox").change(function() {
	    var isChecked = $(this).attr("checked");
	    var hintLabel = $(".label_checkbox-hint");
	    if(isChecked) {
	        hintLabel.text("带薪");
	    }else{
	        hintLabel.text("不带薪");
	    }
	})
	//加载请假列表
	function loadList() {
	    $.ajax({
	        type: 'GET',
	        url: requestBaseUrl + 'companies/users/leave',
	        async: false,
	        headers: {
	            "Authorization": "Bearer " + getToken()
	        },
	        success: function(data) {
	        	layer.closeAll();
	            if (data.status == 10001) {	            	
	                // showList(data);
	                list=data.data.list
	                console.log(list)
	                if (list == null || list.length == 0) {
	        		$('#tab-page-list').html('<div class="hint">暂无历史请假记录</div>');
	        return;
	    }
	            } else {
	            	 vueThis.$message('错误' + data.status)
	                // $.toast('错误' + data.status);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	        	vueThis.$message('加载请假记录出错')
	            // $.toast('加载请假记录出错');
	        }
	    });
	}

	

	//选择抄送对象，调用Java的选择企业通讯录方法
	$('#item-deliver').click(function() {
	    if (window.js_interface) {
	        window.js_interface.selectDeliver();
	    }
	})

	var leaveTypesArray = [];
	var leaveTypesNameArray = [];

	//获取请假类型
	function loadLeaveTypes() {
	    $.ajax({
	        type: 'GET',
	        url: requestBaseUrl + 'companies/leave/types',
	        async: false,
	        headers: {
	            'Authorization': 'Bearer ' + getToken()
	        },
	        success: function(response) {
	            if (response.status == 10001) {
	                var arr = response.data.list;
	                leaveTypesArray = arr;
	                for (var i = 0; i < arr.length; i++) {
	                    leaveTypesNameArray.push(arr[i].name);
	                }
	                // showLeaveTypes(leaveTypesNameArray);	                
	            }
	        }
	    });
	}
	//加载请假审核列表
	function loadCheckLeaveList() {
	    $.ajax({
	        type: 'GET',
	        url: requestBaseUrl + 'companies/users/leave/check',
	        async: false,
	        headers: {
	            'Authorization': 'Bearer ' + getToken()
	        },
	        success: function(response) {
	            if(response.status == 10001) {
	            	console.log(response.data.list)
	                 list2 = response.data.list;
	                if(list2.length > 0) {
	                    showCheckLeaveList(list);
	                   
	                }else{
	                    showNoCheckLeaveHint();
	                }
	            }
	        },
	        error: function() {
	            showNoCheckLeaveHint();
	        }
	    })
	}

	//显示请假审核列表
	function showCheckLeaveList(list) {
	   //同意按钮的点击处理	   
	    	vueThis.isAgree=function(even){
	    		operateAgreeOrNot(even.target.id, true, list);	       
	    	}
	        	  
	    //不同意按钮的点击处理	   
	    	vueThis.isAgree2=function(even){
	    		operateAgreeOrNot(even.target.id, false, list);	      
	    	}	
	}	
	//操作某条申请，同意或者拒绝
	function operateAgreeOrNot(id, isAgree, list) {
	    var url = requestBaseUrl + 'companies/users/leave/' + id;
	    var type = 'PUT';
	    if(!isAgree) {
	        //拒绝加班申请，请求的method为delete，同意的method为put
	        type = "DELETE";
	    }
	    $.ajax({
	        url: url,
	        type: type,
	        headers: {
	            'Authorization': 'Bearer ' + getToken()
	        },
	        success: function(response) {
	            if(response.status == 10001) {
	            	vueThis.$message('操作成功')
	                // $.toast('操作成功')
	                //删除当前列表中的操作项
	                $('div#card-id-' + id).remove();
	                if(list.length == 1) {
	                    //删除成功后，列表为空，则显示提示信息
	                    showNoCheckLeaveHint();
	                }
	            }else{
	            	vueThis.$message('操作失败，错误码：' + response.status)
	                // $.toast('操作失败，错误码：' + response.status);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	        	vueThis.$message('操作失败')
	            // $.toast('操作失败');
	        }
	    })
	}

	//提交请假申请
function submitLeaveApply(id, reason, startTime, endTime, hours, have_salary, msg) {
    // $.showPreloader('请稍等...');
    layer.open({
    	type:2
    })
    // vueThis.$message({
    // 	message:'请稍等...',
    // 	duration:0
    // })
    $.ajax({
        url: requestBaseUrl + 'companies/users/leave',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        data: {
            leave_type: id,
            reason: reason,
            start_time: strToUnixTimestamp(startTime + ':00'),
            end_time: strToUnixTimestamp(endTime + ':00'),
            times: hours,
            have_salary: have_salary
        },
        success: function(response) {
        	layer.open({
        		content:'提交成功'
        	})
        	setTimeout(function(){
        		layer.closeAll()
        	},1000)
            // $.toast('提交成功');            
            // $.hidePreloader();
            // vueThis.$message('提交成功')
            // vueThis.$message.closeAll()
            vueThis.clearForm();
            //用聊天消息的形式发送给上级
            if(window.js_interface && !isEmpty(myLeaderEaseMobUsername)) {
                var url = projectBaseUrl + "leave.html?check=true";
                var jsonObj = {
                    msg: msg,
                    myLeaderEaseMobUsername: myLeaderEaseMobUsername,
                    url: url
                };
                try {
                    window.js_interface.sendApplyMessage(JSON.stringify(jsonObj));
                }catch(e) {
                    console.log(e);
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // $.toast('提交失败');
            // $.hidePreloader();
            vueThis.$message('提交失败')
            vueThis.$message.closeAll()
        }
    })
}

//提交加班申请
function submitOvertimeApply(title, reason, startTime, endTime, hours, have_salary, msg) {
    // $.showPreloader('请稍等...');
    vueThis.$message({
    	message:'请稍等...',
    	duration:0
    })
    $.ajax({
        url: requestBaseUrl + 'companies/users/overtime',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        data: {
            title: title,
            reason: reason,
            start_time: strToUnixTimestamp(startTime + ':00'),
            end_time: strToUnixTimestamp(endTime + ':00'),
            times: hours,
            have_salary: have_salary
        },
        success: function(response) {
            // $.toast('提交成功');
            // $.hidePreloader();
            vueThis.$message('提交成功')
            vueThis.$message.closeAll()
            clearForm();
            //用聊天消息的形式发送给上级
            if(window.js_interface && !isEmpty(myLeaderEaseMobUsername)) {
                var url = projectBaseUrl + "overtime.html?check=true";
                var obj = {
                    msg: msg,
                    myLeaderEaseMobUsername: myLeaderEaseMobUsername,
                    url: url
                };
                try {
                    window.js_interface.sendApplyMessage(JSON.stringify(obj));
                }catch(e) {
                    console.log(e);
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // $.toast('提交失败');
            // $.hidePreloader();
             vueThis.$message('提交失败')
            vueThis.$message.closeAll()
        }
    })
}

	//提示无待审核的请假申请
	function showNoCheckLeaveHint() {
	    $('#tab-page-check-content').html('<div class="hint">暂无待审核的请假申请</div>');
	}

	//清空表单内容
	// $('#btn-clear').click(function() {
	//     $.confirm('确定要清空填写的内容吗？', '提示', function() {
	//         clearForm();
	//     });
	// })
	//提交表单

	$('#btn-submit').click(function() {
	    var type = vueThis.alertstate().state;
	    var reason = $('#leave-reason').val();
	    var startTime =vueThis.startTime1;
	    var endTime = vueThis.endTime1;
	    var hours = $('#hours').val();
	    var isChecked = $("#salary-checkbox").attr('checked');
	    var have_salary;
	    if(isChecked) {
	        have_salary = 1;
	        // $.toast('带薪');
	    }else{
	        // $.toast('不带薪');
	        have_salary = 2;
	    }
	    if (type=='') {
	    	vueThis.$message('请选择请假类型')
	        // $.toast('请选择请假类型');
	        return;
	    }
	    if (isEmpty(reason)) {	    	
	    	vueThis.$message('请填写请假原因')
	        // $.toast('请填写请假原因');
	        return;
	    }
	    if (isEmpty(startTime) || isEmpty(endTime)) {
	    	vueThis.$message('请选择请假时间')
	        // $.toast('请选择请假时间');
	        return;
	    }
	    if (compareDateStr(startTime + ':00', endTime + ':00') != -1) {
	    	vueThis.$message('开始时间必须在结束时间之前')
	        // $.toast('开始时间必须在结束时间之前');
	        return;
	    }
	    if (isEmpty(hours)) {
	    	vueThis.$message('请填写请假小时')
	        // $.toast('请填写请假小时');
	        return;
	    }
	    if (!isNumber(hours) || hours <= 0) {
	    	vueThis.$message('请假小时数填写有误')
	        // $.toast('请假小时数填写有误');
	        return;
	    }
	    // startTime = startTime.getFullYear()+"/"+startTime.getMonth()+1+"/"+startTime.getDate()
	    // endTime = endTime.getFullYear()+"/"+endTime.getMonth()+1+"/"+endTime.getDate()
	    //要发给上级的聊天消息数据
	    var msg = '请假申请单\n类型：' + type + '\n原因：'
	                + reason + '\n开始时间：' + startTime
	                + '\n结束时间：' + endTime;
	    //可以提交数据了
	    submitLeaveApply(getLeaveTypeIdByName(type), reason, startTime, endTime, hours, have_salary, msg);
	})

	//根据请假名称获取对应的ID
	function getLeaveTypeIdByName(typeName) {
	    var obj;
	    var name;
	    for (var i = 0; i < leaveTypesArray.length; i++) {
	        obj = leaveTypesArray[i];
	        name = obj.name;
	        if (name == typeName) {
	            return obj.id;
	        }
	    }
	    return 1;
	}

	//清空表单数据
	// function clearForm() {
	//     $('#select-type').val('');
	//     $('#leave-reason').val('');
	//     // $('#st  ime-picker').val('');
	//     $('#hours').val('');
	// }

	//加载请假记录
	loadList();
	for(var i=0;i<list.length;i++){
		list[i].start_time=getTimeStr(list[i].start_time)
		list[i].end_time=getTimeStr(list[i].end_time)
	}
	this.list=list	
	// console.log(this.list)
	//加载请假类型
	loadLeaveTypes(leaveTypesNameArray);
	for(var i=0;i<leaveTypesNameArray.length;i++){
		leaveTypesNameArray[i]={'value':leaveTypesNameArray[i]}
	}
	 this.restaurants=leaveTypesNameArray
	console.log(leaveTypesNameArray)
	// this.restaurants =leaveTypesNameArray


	//加载请假审核列表
	loadCheckLeaveList();
	for(var i=0;i<list2.length;i++){
		list2[i].start_time=getTimeStr(list2[i].start_time)
		list2[i].end_time=getTimeStr(list2[i].end_time)
	}
	this.list2=list2

	//同意按钮的点击处理
	    $('[class="link agree"]').click(function() {
	        showAgreeOrNotDialog($(this).attr('id'), true, list);
	       vueThis.$message('agree id = ' + $(this).attr('id'))
	        // $.toast('agree id = ' + $(this).attr('id'));
	    });
	    //不同意按钮的点击处理
	    $('[class="link disagree"]').click(function() {
	        showAgreeOrNotDialog($(this).attr('id'), false, list);
	       vueThis.$message('disagree id = ' + $(this).attr('id'))
	        // $.toast('disagree id = ' + $(this).attr('id'));
	    });	


	//加载我的上级信息
	getMyLeader();

  	}
  }</script>
