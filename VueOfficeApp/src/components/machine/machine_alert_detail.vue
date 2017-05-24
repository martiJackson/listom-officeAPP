
    <style>
    .card-alert-img {
        height: 200px;
    }
    
    #card-time {
        color: red;
    }
    </style>
<template>
	<div id="app">
		<div class="content" id="content">
	        <div class="card">
	            <div class="card-header" id="card-time"></div>
	            <div class="card-content">
	                <div class="card-content-inner" id="card-image"></div>
	            </div>
	            <div class="card-footer" id="card-manager"></div>
	        </div>
	        <div class="card" id="take-picture">
	            <div class="card-content">
	                <div class="list-block">
	                    <ul>
	                        <li class="item-content item-link">
	                            <div class="item-inner">
	                                <div class="item-title" style="font-size: 0.85em; color: red;">故障拍照</div>
	                            </div>
	                        </li>
	                    </ul>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
</template>

<script type="text/javascript">
 	export default {
            data(){
              return {}
          },
          mounted:function(){
          	var vueThis=this;
		    var machineId=getUrlParam('machineId');
		    var alertId=getUrlParam('alertId');
		    getMachineAlertDetail(machineId, alertId);

		    $('#take-picture').bind('touchstart', function() {
		        $(this).css('background-color', '#dcdcdc');
		    });

		    $('#take-picture').bind('touchend', function() {
		        $(this).css('background-color', '');
		    });

		    $('#take-picture').click(function() {
		        if (!Terminal.platform.android){
		            window.location.href = "#/machine_alert_detail?#modify_machine_picture"; //iOS需要根据这个来判断是否修改图片
		        }
		        try {
		            var url = requestBaseUrl + 'iot/companies/machines/' + machineId + '/alert/records/' + alertId + '/pic';
		            window.js_interface.modifyMachinePic(url);
		        } catch (e) {
		            if (Terminal.platform.android){
		                // $.alert('请在工厂宝APP上使用本功能，或者升级工厂宝APP到最新版本。', '提示'); 
		                vueThis.$message('请在工厂宝APP上使用本功能，或者升级工厂宝APP到最新版本。')   
		            }
		        }
		    });

		    //根据机床id和报警id查看该报警详情
		    function getMachineAlertDetail(machineId, alertId) {
		        $.ajax({
		            type: 'GET',
		            url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/alert/records/' + alertId,
		            headers: {
		                'Authorization': 'Bearer ' + getToken()
		            },
		            success: function(response) {
		                console.log('get alert detail: ' + formatJSON(JSON.stringify(response)));
		                if (response.status == 10001) {
		                    showMachineAlertDetail(response.data);
		                }
		            },
		            error: function(jqXHR, textStatus, errorThrown) {
		                console.log(errorThrown);
		            }
		        })
		    }

		    //显示报警详情
		    function showMachineAlertDetail(data) {
		        var time = getTimeStr(data.time);
		        $('#card-time').html('报警时间：' + time);
		        if (data.pic.length == 0) {
		            $('#card-image').html('暂无报警图片');
		        } else {
		            var imageUrl = 'https://img.listome.com' + data.pic;
		            var html = '<img class="card-alert-img" src="' + imageUrl + '">';
		            $('#card-image').html(html);
		        }
		        getManagerNames(data.manager_ids);
		    }

		    //根据id数组获取对应的姓名数组
		    function getManagerNames(ids) {
		        $.ajax({
		            type: 'GET',
		            url: requestBaseUrl + 'companies/users/names',
		            data: {
		                user_ids: JSON.stringify(ids)
		            },
		            headers: {
		                'Authorization': 'Bearer ' + getToken()
		            },
		            success: function(response) {
		                if (response.status == 10001) {
		                    var nameArr = response.data.names;
		                    var names = '';
		                    if (nameArr.length > 0) {
		                        for (var i = 0; i < nameArr.length; i++) {
		                            names += nameArr[i] + ', ';
		                        }
		                        $('#card-manager').html('机床负责人：' + names.substring(0, names.length - 2));
		                    }
		                }
		            },
		            error: function(jqXHR, textStatus, errorThrown) {
		                console.log(errorThrown);
		            }
		        })
		    }


		    //获取报警记录
		    function getMachineAlertRecords(machineId) {
		        $.ajax({
		            type: 'GET',
		            url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/alert/records',
		            headers: {
		                'Authorization': 'Bearer ' + getToken()
		            },
		            success: function(response) {
		                console.log('get machine alert records: ' + formatJSON(JSON.stringify(response)));
		                if (response.status == 10001) {
		                    if (response.data.total > 0) {
		                        var list = response.data.list;
		                        showAlertList(list);
		                    }
		                }
		            },
		            error: function(jqXHR, textStatus, errorThrown) {
		                console.log(errorThrown);
		            }
		        })
		    }

		    //显示报警列表
		    function showAlertList(list) {
		        // var data = {
		        //     list: list
		        // };
		        // template.helper('getTimeStr', getTimeStr);
		        // $('ul#list').html(template('alert-record-row', data));
		        $('li.item-link').click(function() {
		            //跳转到报警详情
		            // $.toast('detail, id = ' + $(this).attr('id') + '-' + machineId);
		            vueThis.$message('detail, id = ' + $(this).attr('id') + '-' + machineId)
		        })
		    }
          }
      }    
</script>
