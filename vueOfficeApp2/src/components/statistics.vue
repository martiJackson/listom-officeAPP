<template>
	<div id="statistics">
		<div class="page-group" id="groups">
	        <div class="page" id='router'>
	            <div class="list-block" id="list-boss">
	                <ul>
	                    <li class="item-content item-link" id="boss-menu-attendance">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">整体考勤数据统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-overtime">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">整体加班数据统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-leave">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">整体请假数据统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-salary">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">整体工资发放统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-overtime-top10">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">加班前十名统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-late-top10">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">迟到前十名统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-machine">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">机床整体月数据统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-machine-day">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">机床整体当天数据统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="boss-menu-workshop-statistic">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">车间数据统计</div>
	                        </div>
	                    </li>
	                </ul>
	            </div>
	            <div class="list-block" id="list-employee">
	                <ul>
	                    <li class="item-content item-link" id="employee-menu-attendance">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">个人考勤数据统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="employee-menu-overtime">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">个人加班数据统计</div>
	                        </div>
	                    </li>
	                    <li class="item-content item-link" id="employee-menu-leave">
	                        <div class="item-media"><i class="icon icon-f7"></i></div>
	                        <div class="item-inner">
	                            <div class="item-title">个人请假数据统计</div>
	                        </div>
	                    </li>
	                </ul>
	            </div>
	        </div>
	    </div>
	</div>
</template>
<style>
	.content-block-title {
	    color: #ff6101;
	}
	.item-title {
	    color: #6d6d72;
	}
	#list-boss {
	    display: none;
	}
	#groups{
		display: block;
	}
</style>

<script type="text/javascript">
	 export default {
	    data(){
	      return {	        
	      }
	    }
	    ,mounted:function(){
	    	$("#titleName").text('数据统计');
	    	layer.closeAll();
	    	//添加返回到上一页功能。iOS没有提供接口
			if (window.js_interface) {
			    try {
			        window.js_interface.useGoBack(true);
			    } catch (e) {
			        console.log(e);
			    }
			}
			//点击列表跳转到对应的统计页面
			$('.item-content').click(function() {
			    var id = $(this).attr('id');
			    var url = '';
			    switch (id) {
			        case "boss-menu-attendance": //老板  整体出勤统计
			            url = "#/statistics_boss_attendance";
			            break;
			        case "boss-menu-overtime": //老板  整体加班统计
			            url = "#/statistics_boss_overtime";
			            break;
			        case "boss-menu-leave": //老板  整体请假统计
			            url = "#/statistics_boss_leave";
			            break;
			        case "boss-menu-salary": //老板  整体工资统计
			            url = "#/statistics_boss_salary";
			            break;
			        case "boss-menu-overtime-top10": //老板  加班前十统计
			            url = "#/statistics_boss_overtime_top";
			            break;
			        case "boss-menu-late-top10": //老板  迟到前十统计
			            url = "#/statistics_boss_late_top";
			            break;
			        case "boss-menu-machine": //老板，机床整体月数据统计
			            url = "#/statistics_boss_machine";
			            break;
			        case "boss-menu-machine-day": //老板，机床整体当天数据统计
			            url = "#/all_machines_statistics";
			            break;
			        case "boss-menu-workshop-statistic": //老板  车间数据统计
			            url = "#/statistics_workshop_list";
			            break;
			        case "employee-menu-attendance": //员工  个人考勤统计
			            url = "#/statistics_employee_attendance";
			            break;
			        case "employee-menu-overtime": //员工  个人加班统计
			            url = "#/statistics_employee_overtime";
			            break;
			        case "employee-menu-leave": //员工  个人请假统计
			            url = "#/statistics_employee_leave";
			            break;
			    }
			    window.location = url;
			});

			var role = getRole();
			if (role == 3) { //角色为老板，显示两个列表
			    $('#list-boss').show();
			    $('#list-employee').show();
			} else { //角色为普通员工，显示个人列表
			    $('#list-boss').hide();
			    $('#list-employee').show();
			}

			// 加上
			// 1）一个月迟到率部门每天线性统计图
			// 2）一个月迟到人数清单，重点突出前十名
			// 3）每月迟到最少的前十位
			// 4）部门加班率统计图
			// 5）每月加班时间率部门每天线性统计图
			// 6）加班人数清单，加班时间最多前10名和最少人清单前10名
			// 7）每年可以评出迟到早退最少的最勤奋前十位员工

				    }
				}
</script>