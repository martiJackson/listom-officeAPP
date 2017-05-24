
    <style>
    img.machine-img {
        width: 100%;
        min-height: 300px;
        background-color: white;
        position: relative;
    }
    
    span.image-text {
        position: absolute;
        left: 2px;
        top: 2px;
        color: white;
        background-color: black;
        opacity: 0.5;
        font-size: 0.8em;
        display: none;
    }
    .item-title.label{
        text-align: left;
    }
    </style>
    <template>
        <div id="app">
            <div class="content" id="content">
                <div>
                    <img class="machine-img" v-if="data.pic ==''" src="/static/images/machine_default.jpg" >
                    <img class="machine-img" v-else :src="'https://img.listome.com'+data.pic">        
                    <span class="image-text">点击图片可修改</span>
                </div>
                <div class="content-block-title">机床详细信息</div>
                <div class="list-block">
                    <ul>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">机床编号</div>
                                <div class="item-after">{{data.sn}}</div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">机床类型</div>
                                <div class="item-after">{{data.type}}</div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">机床型号</div>
                                <div class="item-after">{{data.model}}</div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">机床品牌</div>
                                <div class="item-after">{{data.brand}}</div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">购入日期</div>
                                <!-- <div class="item-after">{{data.buy_date | getTimeStr:''}}</div> -->
                                <div class="item-after" v-if='data.buy_date<=0'>无</div>
                                <div class="item-after" v-else>{{data.buy_date}}</div>                                
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">保养周期</div>
                                <div class="item-after" v-if='data.maintenance_cycle<=0'>无</div>
                                <div class="item-after" v-else>每{{data.maintenance_cycle / 86400}}天一次</div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title">上次保养日期</div>
                                <div class="item-after" v-if='data.last_maintenance_date<=0'>无</div>
                                <div class="item-after" v-else>{{data.last_maintenance_date}}</div>
                            </div>
                        </li>
                        <li class="item-content item-link" id="menu-maintenance-detail">
                            <div class="item-inner">
                                <div class="item-title">保养详情</div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">备注</div>
                                <div class="item-after no-permission" v-if="data.remark == ''">
                                    无
                                </div>
                                 <div class="item-after no-permission" v-else>
                                    {{data.remark}}
                                 </div>
                                <div class="item-input has-permission" style="display: none;">
                                    <input type="text" id="remark-input" placeholder="填写备注信息" :value="data.remark">
                                </div>
                                <div class="item-after has-permission" style="display: none;">
                                    <a href="#" class="button" id="btn-submit-remark">提交</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block-title">机床数据统计</div>
                <div class="list-block">
                    <ul>
                        <li class="item-content item-link" id="menu-single-machine-statistics-day">
                            <div class="item-inner">
                                <div class="item-title">查看该机床今日统计数据</div>
                            </div>
                        </li>
                        <li class="item-content item-link" id="menu-single-machine-timeline-statistics-day">
                            <div class="item-inner">
                                <div class="item-title">查看该机床时间轴数据</div>
                            </div>
                        </li>
                        <li class="item-content item-link" id="menu-single-machine-statistics-month">
                            <div class="item-inner">
                                <div class="item-title">查看该机床月统计数据</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block-title">机床故障</div>
                <div class="list-block">
                    <ul>
                        <li class="item-content item-link" id="menu-machine-alert">
                            <div class="item-inner">
                                <div class="item-title">查看机床故障</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block-title">工具</div>
                <div class="list-block">
                    <ul>
                        <li class="item-content item-link" id="menu-machine-calculate">
                            <div class="item-inner">
                                <div class="item-title">加工计算器</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </template>
    <script type="text/javascript">
        export default {
            data(){
              return {
                data:''
              }
          },
          mounted:function(){
            var vueThis=this;
            //获取车间ID，机床ID，机床name 
            var workshopId = getUrlParam('workshopId');
            var machineId = getUrlParam('machineId');
            var machineName = getUrlParam('machineName');
            var hasPermission = 0; //是否有权限修改机器信息, 0：无权限， 1：有权限
            if (machineName != null && machineName != undefined && machineName != '') {
                $('title').text(machineName + '机床详情');
            }
            getMachineDetail(workshopId, machineId);
            //获取机床详情
            function getMachineDetail(workshopId, machineId) {
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines/' + machineId,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        console.log('machine detail: ' + JSON.stringify(response));
                        if (response.status == 10001) {
                            showMachineDetail(response.data);
                        } else {
                            // $.toast('获取机床详情出错' + response.status);
                            vueThis.$message('获取机床详情出错' + response.status)
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // $.toast('获取机床详情出错');
                        vueThis.$message('获取机床详情出错')
                    }
                })
            }


            //显示机床详情
            function showMachineDetail(data) {
                if(data.buy_date>0){
                    data.buy_date=getTimeStr(data.buy_date)   
                }
                if(data.last_maintenance_date>0){
                    data.last_maintenance_date=getTimeStr(data.last_maintenance_date)
                }                             
                vueThis.data=data
                console.log(data)
                addClickOperation();
                getPermission(workshopId, machineId);
            }

            //添加点击处理
            function addClickOperation() {
                //单台机器当天的统计数据
                $('#menu-single-machine-statistics-day').click(function() {
                    window.location = '#/single_machine_statistics?workshopId=' +
                        workshopId + '&machineId=' + machineId + '&machineName=' +encodeURIComponent(machineName);
                });
                //单台机器月统计数据
                $('#menu-single-machine-statistics-month').click(function() {                  
                    window.location ='#/single_machine_statistics_month?workshopId='+workshopId+'&machineId=' +
                     machineId + '&machineName=' + encodeURIComponent(machineName);
                });
                //报警记录
                $('#menu-machine-alert').click(function() {
                    window.location = '#/machine_alert_records?id=' + machineId;
                });
                //保养详情
                $('#menu-maintenance-detail').click(function() {
                    window.location.href = "#/single_machine_maintenance_detail?machineId=" + 
                     machineId + "&machineName=" + encodeURIComponent(machineName)+ "&hasPermission=" + hasPermission;

                });
                //计算
                $('#menu-machine-calculate').click(function() {
                    window.location = '#/calculate?id=' + machineId + '&machineName=' + encodeURIComponent(machineName);
                });
                //时间轴
                $('#menu-single-machine-timeline-statistics-day').click(function() {
                    window.location = '#/single_machine_timeline_statistics?workshopId=' +
                        workshopId + '&machineId=' + machineId + '&machineName=' + encodeURIComponent(machineName);
                });
            }

            //获取是否有机器管理权限，有权限的话则可以修改备注和机器图片
            function getPermission(workshopId, machineId) {
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines/' + machineId + '/manager/access',
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        console.log('get permission: ' + JSON.stringify(response));
                        if (response.status == 10001) {
                            //有权限修改机器信息，点击图片可修改图片，也可修改备注信息
                            hasPermission = 1;
                            $('span.image-text').show();
                            $('div.no-permission').hide();
                            $('div.has-permission').show();
                            //提交备注信息
                            $('#btn-submit-remark').click(function() {
                                    var remarkContent = $('#remark-input').val();
                                    if (remarkContent == '' || remarkContent.trim() == '') {
                                        // $.toast('请填写备注再提交');
                                        vueThis.$message('请填写备注再提交')
                                    } else {
                                        //这里提交备注
                                        submitRemark(remarkContent, workshopId, machineId);
                                    }
                                })
                                //点击图片修改图片
                            $('img.machine-img').click(function() {
                                if (!Terminal.platform.android) {
                                    window.location.href = "#/machine_detail#modify_machine_picture"; //iOS需要根据这个来判断是否修改图片
                                    // vueThis.$parent.modify_machine_picture=true;
                                }
                                try {
                                    var url = requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines/' + machineId + '/info';
                                    window.js_interface.modifyMachinePic(url);
                                } catch (e) {
                                    //如果是android平台，则提示错误，iOS平台不提示
                                    if (Terminal.platform.android) {
                                        // $.alert('请在工厂宝APP上使用本功能，或者升级工厂宝APP到最新版本。', '提示');
                                        vueThis.$message('请在工厂宝APP上使用本功能，或者升级工厂宝APP到最新版本。')
                                    }
                                }
                            });
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('get permission error: ' + textStatus);
                    }
                })
            }

            //提交备注信息
            function submitRemark(remark, workshopId, machineId) {
                // $.showPreloader();
                vueThis.$message({
                    message:'正在提交备注信息',
                    duration:0
                })
                $.ajax({
                    type: 'POST',
                    url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines/' + machineId + '/info',
                    data: {
                        remark: remark
                    },
                    ecntype: 'multipart/form-data',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        $.hidePreloader();
                        if (response.status == 10001) {
                            // $.toast('修改备注信息成功');
                            vueThis.$message('修改备注信息成功')
                        } else {
                            // $.toast('修改备注信息失败');
                            vueThis.$message('修改备注信息失败')
                        }
                    },
                    error: function(jqXHR) {
                        // $.hidePreloader();
                        // $.toast('修改备注信息失败');
                        vueThis.$message.closeAll()
                        vueThis.$message('修改备注信息失败')
                    }
                });
            }
          }
      }
    
    </script>
