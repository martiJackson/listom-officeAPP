
var dateNow = getTimeNow();
$('#calendar').calendar({
	dateFormat: 'yyyy/mm/dd',
	value: [dateNow.year + '/' + dateNow.month + '/' + dateNow.day],
	minDate: [(dateNow.year - 1) + '/01/01'],
	maxDate: [dateNow.year + '/12/31'],
	onChange: function(p, values, displayValues) {
		var arr = displayValues.toString().split('/');
		var year = parseInt(arr[0], 10);
		var month = parseInt(arr[1], 10);
		var day = parseInt(arr[2], 10);
		var startTime = getUnixStartTime(year, month, day);
		var endTime = getUnixEndTime(year, month, day);
		// alert('start time = ' + startTime + '\n' + 'end time = ' + endTime);
		loadRecords(displayValues, startTime, endTime);
	},
});

//加载打卡记录
function loadRecords(dateStr, startTime, endTime) {
    $.ajax({
        type: 'GET',
        url: requestBaseUrl + 'companies/users/checkin_results',
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        data: {
        	start_time: startTime,
        	end_time: endTime,
        	offset: '0',
        	skip: '0'
        },
        success: function(response) {
            if(response.status == 10001) {
            	var arr = response.data.list;
            	if(arr != null && arr.length > 0) {
	            	var content = '<div class="list-block"><ul>';
	            	for(var i = 0; i < arr.length; i++) {
	            		content += '<li class="item-content">';
	            		content += '<div class="item-inner">';
	            		content += '<div class="item-title">' + (i+1) + '</div>';
	            		content += '<div class="item-after">' + arr[i].user_name + '</div>';
	            		content += '<div class="item-after">' + getTimeStr(arr[i].checkin_time) + '</div>';
						if(arr[i].status == -1){
							content += '<div class="item-after"><button class="button button-fill button-warning">迟到</button></div>';
						}else if(arr[i].status == -2){
							content += '<div class="item-after"><button class="button button-fill button-danger">早退</button></div>';
						}else{
							content += '<div class="item-after"><button class="button button-fill button-success">正常</button></div>';
						}
	            		content += '</div>';
	            		content += '</li>';
	            	}
	            	content += '</ul></div>';
	            	var height = $('#calendar-container').height();
	            	$('#list').css('margin-top', height);
	            	$('#list').html(content);
            	}else{
					// $.toast(dateStr);
            		var height = $('#calendar-container').height();
            		$('#list').css('margin-top', height);
            		$('#list').html('<div class="hint">' + dateStr + '没有打卡记录</div>');
            	}
            }else{
            	$.toast('错误' + response.status);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
        	$.toast('加载打卡记录失败');
        }
    });
}

//获取某一天的起始Unix时间戳
function getUnixStartTime(year, month, day) {
	var date = new Date();
	date.setFullYear(year);
	date.setMonth(month - 1);
	date.setDate(day);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	return parseInt(date.getTime() / 1000);
}

//获取某一天的结束Unix时间戳
function getUnixEndTime(year, month, day) {
	var date = new Date();
	date.setFullYear(year);
	date.setMonth(month - 1);
	date.setDate(day);
	date.setHours(23);
	date.setMinutes(59);
	date.setSeconds(59);
	return parseInt(date.getTime() / 1000);	
}

