<style type="text/css">
    .chart-content {
        width: 100%;
        height: 500px;
    }
</style>
<template>
    <div id="app">
        <div class="content">
            <div class="content-block-title">整体请假数据统计列表</div>
            <div class="list-block" id="list-content"></div>
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
                    var data = {};
                    getOvertime();
                    console.log(yearNow)
                    //获取公司整体请假数据
                    function getOvertime() {
                        $.ajax({
                            url: requestBaseUrl + 'companies/statistic/leavies',
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
                                    showData(data);
                                } else {
                                    // $.toast('获取数据失败');
                                    vueThis.$message('获取数据失败')
                                }
                            },
                            error: function(jqXHR) {
                                console.log("request error!");
                                // $.toast('获取数据失败');
                                vueThis.$message('获取数据失败')
                            }
                        })
                    }

                    //显示数据
                    function showData(obj) {
                        var str = '<ul>';
                        str += generateListItem('总请假天数', obj.times + '天');
                        str += generateListItem('总请假次数', obj.count + '次');
                        str += generateListItem('请假人数', obj.person_count + '人');
                        str += '</ul>';
                        $('#list-content').html(str);
                    }

                    //生成一个列表item
                    function generateListItem(title, after) {
                        var str = '';
                        str += '<li class="item-content">';
                        str += '<div class="item-inner">';
                        str += '<div class="item-title">' + title + '</div>';
                        str += '<div class="item-after">' + after + '</div>';
                        str += '</div>';
                        str += '</li>';
                        return str;
                    }
                }
            }
    
    </script>
