<style type="text/css">    
    th {
        background-color: #ececec;
    }
    .listNull{
        font-size:1.1rem;
        width:100%;
        text-align: center;
        position:absolute;
        top:10%;
        color: rgba(0,0,0,.4);
    }
    .fontSize *{
        font-size:1.1rem;
    }
    tr>th:first-of-type{
        padding-left:1rem;
    }
</style>
<template>
    <div id="app" class="fontSize" style="margin-top:-60px;!important">
        <div class="container-fluid" style="padding: 0; margin:0;">
            <table class="table table-hover">
                <caption style="text-align:center">机床工作历史记录表</caption>
                <tr>
                    <th>序号</th>
                    <th>任务名称</th>
                    <th>工件编号</th>
                    <th>工件名称</th>
                    <th>操作人</th>
                    <th>备注</th>
                </tr>
            </table>
        </div>
    </div>
</template>
    <script type="text/javascript">
        export default {
                  data(){
                    return {
                    }
                },
                mounted:function(){
                    // status.js

                    //根据机器id获取该机器的历史任务记录
                    function getWorkHistory(machineId) {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/task/history',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: {
                                machine_id: machineId,
                                offset: 0,
                                skip: 9
                            },
                            success: function(response) {
                                console.log('get work history: \n' + formatJSON(JSON.stringify(response)));
                                if(response.status == 10001) {
                                    showWorkHistory(response.data.list, machineId);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                            }
                        })
                    }

                    //显示任务历史记录
                    function showWorkHistory(list, machineId) {
                        if(list==null){
                           $('table.table').append('<p class="listNull" style="margin-top:2rem">该机器没有历史工作记录</p>')
                        }else if(list.length > 0) {
                            var html = '';
                            for(var i = 0; i < list.length; i++) {
                                var obj = list[i];
                                html += '<tr class="data">';
                                html += '<td>' + (i + 1) + '</td>';
                                html += '<td>' + obj.name + '</td>';
                                html += '<td>' + obj.workpiece_sm + '</td>';
                                html += '<td>' + obj.workpiece_name + '</td>';
                                html += '<td id="operators-' + machineId + '-' + i + '"></td>';
                                html += '<td class="remark-label">' + obj.remark + '</td>';
                                html += '</tr>';
                            }
                            $('tr.data').remove();
                            $(".listNull").remove();
                            $('table.table').append(html);
                            for(var i = 0; i < list.length; i++) {
                                getNamesByIds(list[i].operator_ids, machineId, i);
                            }
                        }
                    } 

                    //根据操作人的id数组获取对应的姓名数组
                    function getNamesByIds(ids, machineId, index) {
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
                                if(response.status == 10001) {
                                    var nameArr = response.data.names;
                                    var names = '';
                                    if(nameArr.length > 0) {
                                        for(var i = 0; i < nameArr.length; i++) {
                                            names += nameArr[i] + ', ';
                                        }
                                        $('td#operators-' + machineId + '-' + index).html(names.substring(0, names.length - 2));
                                    }
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                            }
                        })
                    }   
                    // status.js结束

                    var vueThis=this;
                     // var machineId = getUrlParam('id');
                    var machineId = vueThis.$parent.ID;
                    getWorkHistory(machineId);
                    $('title').append('(最近10条)')
                }
            }
       
    </script>

